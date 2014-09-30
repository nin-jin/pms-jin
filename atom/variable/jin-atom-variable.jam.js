/**
 * @name $jin.atom.variable
 * @class $jin.atom.variable
 * @mixins $jin.klass
 * @mixins $jin.atom.thenable
 * @returns $jin.atom.variable
 */
$jin.klass({ '$jin.atom.variable': [ '$jin.atom.thenable' ] })

/**
 * @name $jin.atom.variable.enableLogs
 * @method enableLogs
 * @static
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable.enableLogs': function( ){
	$jin.mixin( this + '', [ '$jin.atom.logable' ] )
}})

/**
 * Статус, когда значение неопределено.
 *
 * @name $jin.atom.variable.statusNull
 * @method statusNull
 * @member $jin.atom.variable
 * @static
 */
$jin.method({ '$jin.atom.variable.statusNull': $jin.value( 'null' ) })

/**
 * Статус, когда значение установлено.
 *
 * @name $jin.atom.variable.statusValue
 * @method statusValue
 * @member $jin.atom.variable
 * @static
 */
$jin.method({ '$jin.atom.variable.statusValue': $jin.value( 'value' ) })

/**
 * Статус, когда в качестве значения сохранена ошибка.
 *
 * @name $jin.atom.variable.statusError
 * @method statusError
 * @member $jin.atom.variable
 * @static
 */
$jin.method({ '$jin.atom.variable.statusError': $jin.value( 'error' ) })

$jin.glob( '$jin.atom.variable._seed', 0 )

/**
 * @name $jin.atom.variable#init
 * @method init
 * @param {object} config
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..init': function( config ){
	this['$jin.klass..init']
	var klass = this.constructor
	
	this._id = ++$jin.atom.variable._seed
	this._name = config.name
	
	if( config.error ){
		this._value = config.error
		this._status = klass.statusError
	} else {
		this._value = config.value
		this._status = ( config.value === void 0 ) ? klass.statusNull : klass.statusValue
	}
	
	this._slice = 0
	this._owner = config.owner || config.context
	this._slaves = {}
}})

/**
 * @name $jin.atom.variable#destroy
 * @method destroy
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..destroy': function( ){
	this.disleadAll()
	return this['$jin.klass..destroy']()
}})

/**
 * Автогенерированный идентификатор.
 *
 * @name $jin.atom.variable#id
 * @method id
 * @returns {string}
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..id': function( ){
	return this._id
}})

/**
 * @name $jin.atom.variable#status
 * @method status
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..status': function( next ){
	if( !arguments.length ) return this._status
	this._status = next
	return this
}})

/**
 * @name $jin.atom.variable#value
 * @method value
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..value': function( next ){
	if( !arguments.length ) return this._value
	return this.put( next )
}})

/**
 * @name $jin.atom.variable#name
 * @method name
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..name': function( ){
	return this._name + '|' + this._id
}})

/**
 * Текущий номер слоя. На один больше чем максимальный номер среди всех хозяев.
 *
 * @name $jin.atom.variable#slice
 * @method slice
 * @returns {number}
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..slice': function( ){
	return this._slice
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom.variable#get
 * @method get
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..get': function( ){
	var slave = $jin.atom.current
	
	if( slave ){
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._status === this.constructor.statusError ){
		throw this._value
	} else {
		return this._value
	}
}})

/**
 * @name $jin.atom.variable#valueOf
 * @method valueOf
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..valueOf': function( ){
	return this.get()
}})

/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom.variable#change
 * @method change
 * @param {any} next
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..change': function( next, status ){
	this._status = status
	
	var prev = this._value
	if( next === prev ) return this
	
	this._value = next
	
	this.notify( next, prev )

	return this
}})

/**
 * @name $jin.atom.variable#put
 * @method put
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..put': function( next ){
	return this.change( next, this.constructor.statusValue )
}})

/**
 * @name $jin.atom.variable#fail
 * @method fail
 * @param {Error} error
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..fail': function( error ){
	return this.change( error, this.constructor.statusError )
}})

/**
 * @name $jin.atom.variable#clear
 * @method clear
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..clear': function( ){
	//$jin.log('clear',this.name())
	return this.change( void 0, this.constructor.statusNull )
}})

/**
 * Изменить значение используя функцию преобразования.
 *
 * @name $jin.atom.variable#mutate
 * @method mutate
 * @param {function( value )} mutator
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..mutate': function( mutator ){
	
	var slave = $jin.atom.current
	$jin.atom.current = null
	
	try {
		this.put( mutator( this._value ) )
	} catch( error ){
		this.fail( error )
	}
	
	$jin.atom.current = slave
	
	return this
}})

/**
 * Уведомить ведомых, что значение изменилось.
 *
 * @name $jin.atom.variable#notify
 * @method notify
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..notify': function( ){
	
	var slaves = this._slaves
	for( var id in slaves ){
		
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.update( this )
	}

	return this
}})

/**
 * Добавить ведомого.
 *
 * @name $jin.atom.variable#lead
 * @method lead
 * @param {$jin.atom.variable} slave
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..lead': function( slave ){
	
	this._slaves[ slave.id() ] = slave

	return this
}})

/**
 * Убрать ведомого.
 *
 * @name $jin.atom.variable#dislead
 * @method dislead
 * @param {$jin.atom.variable} slave
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..dislead': function( slave ){
	
	this._slaves[ slave.id() ] = void 0

	return this
}})

/**
 * Выгнать всех ведомых и отписать их от себя.
 *
 * @name $jin.atom.variable#disleadAll
 * @method disleadAll
 * @member $jin.atom.variable
 */
$jin.method({ '$jin.atom.variable..disleadAll': function( ){
	var slaves = this._slaves
	
	this._slaves = {}
	
	for( var id in slaves ){
		var slave = slaves[ id ]
		if( !slave ) continue
		
		slave.disobey( this )
	}

}})

/**
 * Возращает атом, который дожидается вычисления текущего, после чего отписывается и вызывает один из колбэков.
 *
 * @name $jin.atom.thenable#then
 * @method then
 * @param {function( result )} [done]
 * @param {function( error }} [fail]
 * @member $jin.atom.thenable
 */
$jin.method({ '$jin.atom.thenable..then': function( done, fail ){

	var promise = $jin.atom({
		name: 'promise',
		context: this,
		pull: function( prev ){
			return prev || this.get()
		},
		merge: function( next, prev ){
			if( next === prev ) return prev
			promise.disobeyAll()
			return done ? done( next ) : next
		},
		fail: fail
	})
	new $jin.defer( promise.pull.bind( promise ) )
	
	return promise
}})

/**
 * Короткая запись для
 *     .then( null, function( error ){ ... } )
 *
 * @name $jin.atom.thenable#catch
 * @method catch
 * @param {function( error }} [fail]
 * @member $jin.atom.thenable
 */
$jin.method({ '$jin.atom.thenable..catch': function( fail ){
	return this.then( null, fail )
}})
