/**
 * @name $jin.atom1.pullable
 * @class $jin.atom1.pullable
 * @mixins $jin.klass
 * @mixins $jin.atom1.variable
 * @returns $jin.atom1.pullable
 */
$jin.klass({ '$jin.atom1.pullable': [ '$jin.atom1.variable' ] })

/**
 * Статус, когда идёт вычисление значения.
 *
 * @name $jin.atom1.pullable.statusSync
 * @method statusSync
 * @member $jin.atom1.pullable
 * @static
 */
$jin.method({ '$jin.atom1.pullable.statusSync': $jin.value( 'sync' ) })

$jin.glob( '$jin.atom1.pullable.pullPlan', [] )
$jin.glob( '$jin.atom1.pullable.clearPlan', [] )
$jin.glob( '$jin.atom1.pullable._defer', null )

/**
 * Инициирует вычисление всех запланированных к вычислению атомов. Вычисление происходит по слоям,
 * чем меньше у атома номер слоя (slice), тем  раньше он будет вычислен.
 *
 * @name $jin.atom1.pullable.induce
 * @method induce
 * @static
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable.induce': function( ){
	var pullable = $jin.atom1.pullable
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
 * @name $jin.atom1.pullable.schedule
 * @method schedule
 * @static
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable.schedule': function( ){
	if( $jin.atom1.pullable._defer ) return

	$jin.atom1.pullable._defer = new $jin.defer( $jin.atom1.pullable.induce )
}})

/**
 * @name $jin.atom1.pullable#init
 * @method init
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..init': function( config ){
	this['$jin.atom1.variable..init']( config )
	this._slavesCount = 0
	this._masters = {}
}})

/**
 * @name $jin.atom1.pullable#slavesCount
 * @method slavesCount
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..slavesCount': function( ){
	return this._slavesCount
}})

/**
 * Получить значение атома (если оно ещё не вычислено – сначала вычислить).
 *
 * @name $jin.atom1.pullable#get
 * @method get
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..get': function( ){
	var status = this._status
	var klass = this.constructor
	
	if( status === klass.statusSync ) throw new Error( 'Circular atom (' + this.name() + ')' )
	
	if( status === klass.statusNull ) this.pull()

	return this['$jin.atom1.variable..get']()
}})

/**
 * @name $jin.atom1.pullable#freeze
 * @method freeze
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..freeze': function( ){
	this.disobeyAll()
	this.status( this.constructor.statusNull )
	return this
}})

/**
 * @name $jin.atom1.pullable#clear
 * @method clear
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..clear': function( ){
	this.freeze()

	return this['$jin.atom1.variable..clear']()
}})

/**
 * Немедленно вычислить значение.
 *
 * @name $jin.atom1.pullable#pull
 * @method pull
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..pull': function( ){
	this._status = this.constructor.statusSync

	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	var prevCurrent = $jin.atom1.current
	$jin.atom1.current = this
	try {
		var next = this._pull.call( this._owner, this._value )
		this.put( next )
	} catch( error ){
		this.fail( error )
	}
	$jin.atom1.current = prevCurrent
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this
}})

/**
 * Запланировать обновление.
 *
 * @name $jin.atom1.pullable#update
 * @method update
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..update': function( atom ){
	var status = this._status
	var pullable = $jin.atom1.pullable
	
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
 * @name $jin.atom1.pullable#obey
 * @method obey
 * @param {$jin.atom} master
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..obey': function( master ){
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

/**
 * Отписать от хозяина.
 *
 * @name $jin.atom1.pullable#disobey
 * @method disobey
 * @param {$jin.atom} master
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

/**
 * Отписаться от всех хозяев и убежать от них.
 *
 * @name $jin.atom1.pullable#disobeyAll
 * @method disobeyAll
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		var master = masters[ id ]
		if( !master ) continue
		
		master.dislead( this )
	}
}})

/**
 * @name $jin.atom1.pullable#lead
 * @method lead
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..lead': function( slave ){
	if( this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom1.variable..lead' ]( slave )

	++this._slavesCount
	
	return this
}})

/**
 * @name $jin.atom1.pullable#dislead
 * @method dislead
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..dislead': function( slave ){
	if( !this._slaves[ slave.id() ] ) return this
	
	this[ '$jin.atom1.variable..dislead' ]( slave )
	
	if( !--this._slavesCount ) this.reap()
	
	return this
}})

/**
 * @name $jin.atom1.pullable#disleadAll
 * @method disleadAll
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..disleadAll': function( ){
	
	this[ '$jin.atom1.variable..disleadAll' ]()
	
	this._slavesCount = 0
	
	this.reap()

	return this
}})

/**
 * @name $jin.atom1.pullable#reap
 * @method reap
 * @member $jin.atom1.pullable
 */
$jin.method({ '$jin.atom1.pullable..reap': function( ){
	if( !this._slice ) return
	
	var pullable = $jin.atom1.pullable
	
	pullable.clearPlan.push( this )
	pullable.schedule()
	
	return this
}})
