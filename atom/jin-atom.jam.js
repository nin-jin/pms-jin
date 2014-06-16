/**
 * Исключение, которое можно бросить в атоме, чтобы прервать вычисление всей текущей цепочки атомов.
 *
 * На любом уровне его можно либо перехватить через try-catch, либо обработать через fail метод атома.
 *
 * @name $jin.atom.wait
 * @class $jin.atom.wait
 * @mixins $jin.error
 * @returns $jin.atom.wait
 */
$jin.error({ '$jin.atom.wait': [] })

/**
 * Атом - минимальный кирпичик реактивного приложения. Умеет:
 *
 *  * хранить в себе значение (value) или ошибку (error)
 *  * лениво вычислять значение (pull) и автоматически подписываться на изменения значений атомов, от которых зависит.
 *  * вызывать обработчики в случае изменения значения (push) или возникновении ошибки (fail)
 *  * сливать новое значение с предыдущим через колбэк (merge)
 *
 * @name $jin.atom
 * @class $jin.atom
 * @cfg {string} name - Имя атома. Используется для отладки. Старайтесь давать атомам уникальные имена.
 * @cfg {any} value - Исходное значение атома. undefined в качестве значения означает, что оно не определено и его надлежит вычислить.
 * @cfg {Error} error - Объект ошибки. При попытке получения значения атома извне она будет бросаться в качестве исключения.
 * @cfg {function( prev )} pull - Функция ленивого вычисления значения.
 * @cfg {function( next, prev )} push - Обработчик изменения значения. В качестве аргументов принимает новое и старое значения.
 * @cfg {function( next, prev )} merge - Функция слияния нового значения со старым. Вызывается перед записью нового значения. Может валидировать, нормализовывать и даже отменять изменение.
 * @cfg {function( error )} fail - Обработчик возникновения ошибки.
 * @cfg {object} context - Контекст в котором вызываются все обработчики.
 * @returns $jin.atom
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.atom': [] })

$jin.atom.current = null
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._config', void 0 )
$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
$jin.glob( '$jin.atom.._pulled', false )
$jin.glob( '$jin.atom.._slavesCount', 0 )
$jin.glob( '$jin.atom.._isScheduled', false )

/**
 * Инициирует вычисление всех запланированных к вычислению атомов. Вычисление происходит по слоям,
 * чем меньше у атома номер слоя (slice), тем  раньше он будет вычислен.
 *
 * @name $jin.atom.induce
 * @method induce
 * @static
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.induce': function( ){
	var scheduled = this.scheduled

	scheduled: for( var i = 0; i < scheduled.length; ++i ){
		var queue = scheduled[i]
		if( !queue ) continue
		scheduled[i] = null
		
		for( var j = 0; j < queue.length; ++j ){
			var atom = queue[ j ]
			if( !atom ) continue
			if( !atom._isScheduled ) continue
			
			atom.pull()
			
			i = -1
		}
	}

	this._deferred = null
}})

/**
 * Запланировать вычисление отложенных атомов как можно скорее.
 *
 * @name $jin.atom.schedule
 * @method schedule
 * @static
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.schedule': function( ){
	if( this._deferred ) return

	this._deferred = $jin.defer( this.induce.bind( this ) )
}})

/**
 * Временно отключить автоматическое слежение за зависимостми, выполнить функцию и включить слежение обратно.
 * Возвращает то, что вернула функция.
 *
 * @name $jin.atom.bound
 * @method bound
 * @param {function} handler
 * @static
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.bound': function( handler ){
	var slave = this.current
	this.current = null
	var res = handler()
	this.current = slave
	return res
}})

/**
 * @name $jin.atom#init
 * @method init
 * @param {object} config
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..init': function jin_atom__init( config ){
	this['$jin.klass..init']
	this._id = $jin.makeId( '$jin.atom' )
	this._config = config
	this._value = config.value
	this._error = config.error
	this._slaves = {}
	this._masters = {}
}})

/**
 * @name $jin.atom#destroy
 * @method destroy
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..destroy': function( ){
	this.disleadAll()
	this.disobeyAll()
	return this['$jin.klass..destroy']()
}})

/**
 * Автогенерированный идентификатор.
 *
 * @name $jin.atom#id
 * @method id
 * @returns {string}
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom#get
 * @method get
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..get': function( ){
	var value = this._value
	if( this._config.pull && ( this._isScheduled || ( value === void 0 ) ) ) value = this.pull()

	var slave = this.constructor.current
	if( slave ){
		if( slave === this ) throw new Error( 'Circular dependency of atoms (' + this._config.name + ')' )
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._error ) throw this._error
	
	return value
}})

/**
 * @name $jin.atom#valueOf
 * @method valueOf
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

/**
 * Немедленно вычислить значение, слить с предыдущим и вернуть его.
 *
 * @name $jin.atom#pull
 * @method pull
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..pull': function( ){
	var config = this._config
	if( !config.pull ) return this._value

	this._isScheduled = false
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	var prevCurrent = this.constructor.current
	this.constructor.current = this
	try {
		var value = config.pull.call( config.context, this._value )
		this.constructor.current = null
		this.put( value )
	} catch( error ){
		this.fail( error )
	}
	this.constructor.current = prevCurrent
	
	this._pulled = true
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom#put
 * @method put
 * @param {any} next
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..put': function( next ){
	var slave = this.constructor.current
	this.constructor.current = null
	
	var config = this._config
	var merge = config.merge
	if( merge ){
		var context = config.context
		var prev = this._value
		var next = merge.call( context, next, prev )
	}
	
	this.value( next )
	this._error = void 0
	this._pulled = false
	
	this.constructor.current = slave
	
	return this
}})

/**
 * @name $jin.atom#fail
 * @method fail
 * @param {Error} error
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

/**
 * Изменить значение используя функцию преобразования.
 *
 * @name $jin.atom#mutate
 * @method mutate
 * @param {function( value )} mutator
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..mutate': function( mutator ){
	var context = this._config.context
	var prev = this._value
	var atom = this
	
	this.constructor.bound( function mutate( ){
		atom.put( mutator.call( context, prev ) )
	})
	
	return this
}})

/**
 * Сохраненный объект ошибки
 *
 * @name $jin.atom#error
 * @method error
 * @returns {Error|null}
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..error': function( ){
	if( arguments.length ) throw new Error( 'Property (error) is read only, use (fail) method' )
	return this._error
}})

/**
 * Прямой доступ к текущему значению.
 *
 * @name $jin.atom#value
 * @method value
 * @param {any} [next]
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..value': function( next ){
	var prev = this._value

	if( !arguments.length ) return prev

	if( next === prev && !this._error ) return this

	this._value = next
	
	var config = this._config
	var context = config.context
	
	var error = this._error
	if( error ){
		var fail = config.fail
		if( fail ){
			fail.call( context, error, prev )
		} else if( !this._slavesCount ){
			if(!( error instanceof this.constructor.wait )){
				$jin.log.error( error )
			}
		}
	} else {
		var push = config.push
		if( push ){
			push.call( context, next, prev )
		}
	}

	this.notify()

	return this
}})

/**
 * Установлено ли текущее значение.
 *
 * @name $jin.atom#defined
 * @method defined
 * @returns {boolean}
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..defined': function( ){
	return ( this._value !== void 0 )
}})

/**
 * Текущий номер слоя. На один больше чем максимальный номер среди всех хозяев.
 *
 * @name $jin.atom#slice
 * @method slice
 * @returns {number}
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..slice': function( ){
	return this._slice
}})

/**
 * Уведомить рабов, что значение изменилось.
 *
 * @name $jin.atom#notify
 * @method notify
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..notify': function( ){
	var slaveExclude = this.constructor.current
	
	var slaves = this._slaves
	for( var id in slaves ){
		var slave = slaves[ id ]
		
		if( !slave ) continue
		if( slave === slaveExclude ) continue
		
		slave.update( this )
	}

	return this
}})

/**
 * Запланировать обновление.
 *
 * @name $jin.atom#update
 * @method update
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..update': function( ){
	if( this._isScheduled ) return
	
	var slice = this._slice

	var queue = this.constructor.scheduled[ slice ]
	if( !queue ) queue = this.constructor.scheduled[ slice ] = []

	queue.push( this )
	this._isScheduled = true

	this.constructor.schedule()

	return this
}})

/**
 * Возыметь власть над рабом.
 *
 * @name $jin.atom#lead
 * @method lead
 * @param {$jin.atom} slave
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..lead': function( slave ){
	var id = slave.id()
	
	var slaves = this._slaves
	if( !slaves[ id ] ){
		slaves[ id ] = slave
		++ this._slavesCount
	}

	return this
}})

/**
 * Приписать к хозяину.
 *
 * @name $jin.atom#obey
 * @method obey
 * @param {$jin.atom} master
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..obey': function( master ){
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

/**
 * Выгнать раба.
 *
 * @name $jin.atom#dislead
 * @method dislead
 * @param {$jin.atom} slave
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..dislead': function( slave ){
	var id = slave.id()
	
	var slaves = this._slaves
	if( slaves[ id ] ){
		slaves[ id ] = void 0
		if( !-- this._slavesCount ) this.reap()
	}

	return this
}})

/**
 * Отписать от хозяина.
 *
 * @name $jin.atom#disobey
 * @method disobey
 * @param {$jin.atom} master
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

/**
 * Выгнать всех рабов и отписать их от себя.
 *
 * @name $jin.atom#disleadAll
 * @method disleadAll
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..disleadAll': function( ){
	var slaves = this._slaves
	this._slaves = {}
	this._slavesCount = 0
	for( var id in slaves ){
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.disobey( this )
	}
	this.reap()
}})

/**
 * Отписаться от всех хозяев и убежать от них.
 *
 * @name $jin.atom#disobeyAll
 * @method disobeyAll
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		var master = masters[ id ]
		if( !master ) continue
		
		master.dislead( this )
	}
	this._slice = 0
}})

/**
 * @name $jin.atom#reap
 * @method reap
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..reap': function( ){
	if( this._config.push ) return this
	if( !this._pulled ) return this
	
	$jin.defer( function jin_atom_defferedReap( ){
		if( this._slavesCount ) return
		this.disobeyAll()
		this._value = void 0
		this._error = void 0
		this._slice = 0
	}.bind( this ))
	
	return this
}})
