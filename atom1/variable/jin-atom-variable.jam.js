/**
 * @name $jin.atom1.variable
 * @class $jin.atom1.variable
 * @mixins $jin.klass
 * @mixins $jin.atom1.thenable
 * @returns $jin.atom1.variable
 */
$jin.klass({ '$jin.atom1.variable': [ '$jin.atom1.thenable' ] })

/**
 * @name $jin.atom1.variable.enableLogs
 * @method enableLogs
 * @static
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable.enableLogs': function( ){
	$jin.mixin( this + '', [ '$jin.atom1.logable' ] )
}})

/**
 * Статус, когда значение неопределено.
 *
 * @name $jin.atom1.variable.statusNull
 * @method statusNull
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusNull': $jin.value( 'null' ) })

/**
 * Статус, когда значение установлено.
 *
 * @name $jin.atom1.variable.statusValue
 * @method statusValue
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusValue': $jin.value( 'value' ) })

/**
 * Статус, когда в качестве значения сохранена ошибка.
 *
 * @name $jin.atom1.variable.statusError
 * @method statusError
 * @member $jin.atom1.variable
 * @static
 */
$jin.method({ '$jin.atom1.variable.statusError': $jin.value( 'error' ) })

$jin.glob( '$jin.atom1.variable._seed', 0 )

/**
 * @name $jin.atom1.variable#init
 * @method init
 * @param {object} config
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..init': function( config ){
	this['$jin.klass..init']
	var klass = this.constructor
	
	this._id = ++$jin.atom1.variable._seed
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
 * @name $jin.atom1.variable#destroy
 * @method destroy
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..destroy': function( ){
	this.disleadAll()
	return this['$jin.klass..destroy']()
}})

/**
 * Автогенерированный идентификатор.
 *
 * @name $jin.atom1.variable#id
 * @method id
 * @returns {string}
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..id': function( ){
	return this._id
}})

/**
 * @name $jin.atom1.variable#status
 * @method status
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..status': function( next ){
	if( !arguments.length ) return this._status
	this._status = next
	return this
}})

/**
 * @name $jin.atom1.variable#value
 * @method value
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..value': function( next ){
	if( !arguments.length ) return this._value
	return this.put( next )
}})

/**
 * @name $jin.atom1.variable#name
 * @method name
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..name': function( ){
	return this._name + '|' + this._id
}})

/**
 * Текущий номер слоя. На один больше чем максимальный номер среди всех хозяев.
 *
 * @name $jin.atom1.variable#slice
 * @method slice
 * @returns {number}
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..slice': function( ){
	return this._slice
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom1.variable#get
 * @method get
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..get': function( ){
	var slave = $jin.atom1.current
	
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
 * @name $jin.atom1.variable#valueOf
 * @method valueOf
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..valueOf': function( ){
	return this.get()
}})

/**
 * Записать новое значение (предварительно слив с текущим).
 *
 * @name $jin.atom1.variable#change
 * @method change
 * @param {any} next
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..change': function( next, status ){
	this._status = status
	
	var prev = this._value
	if( next === prev ) return this
	
	this._value = next
	
	this.notify( next, prev )

	return this
}})

/**
 * @name $jin.atom1.variable#put
 * @method put
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..put': function( next ){
	return this.change( next, this.constructor.statusValue )
}})

/**
 * @name $jin.atom1.variable#fail
 * @method fail
 * @param {Error} error
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..fail': function( error ){
	return this.change( error, this.constructor.statusError )
}})

/**
 * @name $jin.atom1.variable#clear
 * @method clear
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..clear': function( ){
	//$jin.log('clear',this.name())
	return this.change( void 0, this.constructor.statusNull )
}})

/**
 * Изменить значение используя функцию преобразования.
 *
 * @name $jin.atom1.variable#mutate
 * @method mutate
 * @param {function( value )} mutator
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..mutate': function( mutator ){
	
	var slave = $jin.atom1.current
	$jin.atom1.current = null
	
	try {
		this.put( mutator( this._value ) )
	} catch( error ){
		this.fail( error )
	}
	
	$jin.atom1.current = slave
	
	return this
}})

/**
 * Уведомить ведомых, что значение изменилось.
 *
 * @name $jin.atom1.variable#notify
 * @method notify
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..notify': function( ){
	
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
 * @name $jin.atom1.variable#lead
 * @method lead
 * @param {$jin.atom1.variable} slave
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..lead': function( slave ){
	
	this._slaves[ slave.id() ] = slave

	return this
}})

/**
 * Убрать ведомого.
 *
 * @name $jin.atom1.variable#dislead
 * @method dislead
 * @param {$jin.atom1.variable} slave
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..dislead': function( slave ){
	
	this._slaves[ slave.id() ] = void 0

	return this
}})

/**
 * Выгнать всех ведомых и отписать их от себя.
 *
 * @name $jin.atom1.variable#disleadAll
 * @method disleadAll
 * @member $jin.atom1.variable
 */
$jin.method({ '$jin.atom1.variable..disleadAll': function( ){
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
 * @name $jin.atom1.thenable#then
 * @method then
 * @param {function( result )} [done]
 * @param {function( error }} [fail]
 * @member $jin.atom1.thenable
 */
$jin.method({ '$jin.atom1.thenable..then': function( done, fail ){

	var promise = $jin.atom1({
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
 * @name $jin.atom1.thenable#catch
 * @method catch
 * @param {function( error }} [fail]
 * @member $jin.atom1.thenable
 */
$jin.method({ '$jin.atom1.thenable..catch': function( fail ){
	return this.then( null, fail )
}})
