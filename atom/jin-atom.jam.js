$jin.error({ '$jin.atom.wait': [] })

/**
 * @name $jin.atom
 * @class $jin.atom
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
 * @name $jin.atom.bound
 * @method bound
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
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..init': function jin_atom__init( config ){
	'$jin.klass..init'
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
 * @name $jin.atom#id
 * @method id
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

/**
 * @name $jin.atom#get
 * @method get
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..get': function( ){
	var value = this._value
	if( this._config.pull && ( this._isScheduled || ( value === void 0 ) ) ) value = this.pull()

	var slave = this.constructor.current
	if( slave ){
		if( slave === this ) throw new Error( 'Circular dependency of atoms!' )
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
 * @name $jin.atom#put
 * @method put
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
		next = merge.call( context, next, prev )
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
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

/**
 * @name $jin.atom#mutate
 * @method mutate
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
 * @name $jin.atom#error
 * @method error
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..error': function( next ){
	if( arguments.length ) throw new Error( 'Property (error) is read only, use (fail) method' )
	return this._error
}})

/**
 * @name $jin.atom#value
 * @method value
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
 * @name $jin.atom#defined
 * @method defined
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..defined': function( ){
	return ( this._value !== void 0 )
}})

/**
 * @name $jin.atom#slice
 * @method slice
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..slice': function( ){
	return this._slice
}})

/**
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
 * @name $jin.atom#lead
 * @method lead
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
 * @name $jin.atom#obey
 * @method obey
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
 * @name $jin.atom#dislead
 * @method dislead
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
 * @name $jin.atom#disobey
 * @method disobey
 * @member $jin.atom
 */
$jin.method({ '$jin.atom..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

/**
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
