/**
 * @name $jin.atom.pullable
 * @class $jin.atom.pullable
 * @mixins $jin.klass
 * @mixins $jin.atom.variable
 * @returns $jin.atom.pullable
 */
$jin.klass({ '$jin.atom.pullable': [ '$jin.atom.variable' ] })

/**
 * Статус, когда идёт вычисление значения.
 *
 * @name $jin.atom.pullable.statusSync
 * @method statusSync
 * @member $jin.atom.pullable
 * @static
 */
$jin.method({ '$jin.atom.pullable.statusSync': $jin.value( 'sync' ) })

$jin.glob( '$jin.atom.pullable.pullPlan', [] )
$jin.glob( '$jin.atom.pullable.clearPlan', [] )
$jin.glob( '$jin.atom.pullable._defer', null )

/**
 * Инициирует вычисление всех запланированных к вычислению атомов. Вычисление происходит по слоям,
 * чем меньше у атома номер слоя (slice), тем  раньше он будет вычислен.
 *
 * @name $jin.atom.pullable.induce
 * @method induce
 * @static
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable.induce': function( ){
	var pullable = $jin.atom.pullable
	var pullPlan = pullable.pullPlan
	var statusNull = pullable.statusNull

	scheduled: for( var i = 0; i < pullPlan.length; ++i ){
		var queue = pullPlan[i]
		if( !queue ) continue
		pullPlan[i] = null
		
		for( var j = 0; j < queue.length; ++j ){
			var atom = queue[ j ]
			if( !atom ) continue
			if( atom.status() !== statusNull ) continue
			
			atom.pull()
			
			i = -1
		}
	}
	
	while( true ){
		var clearPlan = pullable.clearPlan
		if( !clearPlan.length ) break
		pullable.clearPlan = []
		
		for( var i = 0; i < clearPlan.length; ++i ){
			var atom = clearPlan[ i ]
			if( atom.slavesCount() ) continue
			atom.freeze()
		}
	}
	
	pullable._defer = null
}})

/**
 * Запланировать вычисление отложенных атомов как можно скорее.
 *
 * @name $jin.atom.pullable.schedule
 * @method schedule
 * @static
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable.schedule': function( ){
	if( $jin.atom.pullable._defer ) return

	$jin.atom.pullable._defer = new $jin.defer( $jin.atom.pullable.induce )
}})

/**
 * @name $jin.atom.pullable#init
 * @method init
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..init': function( config ){
	this['$jin.atom.variable..init']( config )
	this._slavesCount = 0
	this._masters = {}
}})

/**
 * @name $jin.atom.pullable#slavesCount
 * @method slavesCount
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..slavesCount': function( ){
	return this._slavesCount
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom.pullable#get
 * @method get
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..get': function( ){
	var status = this._status
	var klass = this.constructor
	
	if( status === klass.statusSync ) throw new Error( 'Circular atom (' + this.name() + ')' )
	
	if( status === klass.statusNull ) this.pull()

	return this['$jin.atom.variable..get']()
}})

/**
 * @name $jin.atom.pullable#freeze
 * @method freeze
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..freeze': function( ){
	this.disobeyAll()
	this.status( this.constructor.statusNull )
	return this
}})

/**
 * @name $jin.atom.pullable#clear
 * @method clear
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..clear': function( ){
	this.freeze()

	return this['$jin.atom.variable..clear']()
}})

/**
 * Немедленно вычислить значение.
 *
 * @name $jin.atom.pullable#pull
 * @method pull
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..pull': function( ){
	this._status = this.constructor.statusSync

	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	var prevCurrent = $jin.atom.current
	$jin.atom.current = this
	try {
		var next = this._pull.call( this._owner, this._value )
		this.put( next )
	} catch( error ){
		this.fail( error )
	}
	$jin.atom.current = prevCurrent
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this
}})

/**
 * Запланировать обновление.
 *
 * @name $jin.atom.pullable#update
 * @method update
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..update': function( atom ){
	var status = this._status
	var pullable = $jin.atom.pullable
	
	if( status === pullable.statusSync ) return
	else if( status === pullable.statusNull ) return
	
	var slice = this._slice

	var pullPlan = pullable.pullPlan
	var queue = pullPlan[ slice ]
	if( !queue ) queue = pullPlan[ slice ] = []

	queue.push( this )
	
	this._status = pullable.statusNull

	pullable.schedule()

	return this
}})

/**
 * Приписать к хозяину.
 *
 * @name $jin.atom.pullable#obey
 * @method obey
 * @param {$jin.atom} master
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..obey': function( master ){
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

/**
 * Отписать от хозяина.
 *
 * @name $jin.atom.pullable#disobey
 * @method disobey
 * @param {$jin.atom} master
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

/**
 * Отписаться от всех хозяев и убежать от них.
 *
 * @name $jin.atom.pullable#disobeyAll
 * @method disobeyAll
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		var master = masters[ id ]
		if( !master ) continue
		
		master.dislead( this )
	}
}})

/**
 * @name $jin.atom.pullable#lead
 * @method lead
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..lead': function( slave ){
	if( this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom.variable..lead' ]( slave )

	++this._slavesCount
	
	return this
}})

/**
 * @name $jin.atom.pullable#dislead
 * @method dislead
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..dislead': function( slave ){
	if( !this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom.variable..dislead' ]( slave )
	
	if( !--this._slavesCount ) this.reap()
	
	return this
}})

/**
 * @name $jin.atom.pullable#disleadAll
 * @method disleadAll
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..disleadAll': function( ){
	
	this[ '$jin.atom.variable..disleadAll' ]()
	
	this._slavesCount = 0
	
	this.reap()

	return this
}})

/**
 * @name $jin.atom.pullable#reap
 * @method reap
 * @member $jin.atom.pullable
 */
$jin.method({ '$jin.atom.pullable..reap': function( ){
	if( !this._slice ) return
	
	var pullable = $jin.atom.pullable
	
	pullable.clearPlan.push( this )
	pullable.schedule()
	
	return this
}})
