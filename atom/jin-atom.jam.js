$jin.error({ '$jin.atom.wait': [] })

$jin.klass({ '$jin.atom': [] })

$jin.atom.slaves = []
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._config', void 0 )
$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
$jin.glob( '$jin.atom.._pulled', false )
$jin.glob( '$jin.atom.._slavesCount', 0 )
$jin.glob( '$jin.atom.._scheduled', false )

$jin.method({ '$jin.atom.induce': function( ){
	var scheduled = $jin.atom.scheduled

	scheduled: for( var i = 0; i < scheduled.length; ++i ){
		var queue = scheduled[i]
		if( !queue ) continue
		scheduled[i] = null
		
		for( var atomId in queue ){
			var atom = queue[ atomId ]
			if( !atom ) continue
			
			atom.pull()
			
			i = -1
		}
	}

	$jin.atom._deferred = null
}})

$jin.method({ '$jin.atom.schedule': function( ){
	if( this._deferred ) return

	this._deferred = $jin.defer( this.induce )
}})

$jin.method({ '$jin.atom.bound': function( handler ){
	$jin.atom.slaves.unshift( null )
	try {
		handler()
	} finally {
		var stack = $jin.atom.slaves
		while( stack.length ){
			var top = stack.shift()
			if( top === null ) break
		}
	}
	return this
}})

$jin.method({ '$jin.atom..init': function jin_atom__init( config ){
	this['$jin.klass..init']
	this._id = $jin.makeId( '$jin.atom' )
	this._config = config
	this._value = config.value
	this._error = config.error
	this._slaves = {}
	this._masters = {}
	this._slice = 0
	this._pulled = false
	this._slavesCount = 0
	this._scheduled = false
}})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	if( this._config.pull && ( this._scheduled || ( this._value === void 0 ) ) ) this.pull()

	var slave = $jin.atom.slaves[0]
	if( slave ){
		slave.obey( this )
		this.lead( slave )
	}
	
	if( this._error ) throw this._error
	
	return this._value
}})

$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

$jin.method({ '$jin.atom..pull': function( ){
	var config = this._config
	if( !config.pull ) return this._value

	if( this._scheduled ){
		this._scheduled = false
		var queue = $jin.atom.scheduled[ this._slice ]
		if( queue ){
			queue[ this._id ] = null
		}
	}
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0
	
	if( $jin.atom.slaves.indexOf( this ) >= 0 ) throw new Error( 'Recursive atom' )
	$jin.atom.slaves.unshift( this )
	try {
		try {
			var value = config.pull.call( config.context, this._value )
		} finally {
			var stack = $jin.atom.slaves
			while( stack.length ){
				var top = stack.shift()
				if( top === this ) break
			}
		}
		this.put( value )
	} catch( error ){
		this.fail( error )
	}

	this._pulled = true
	
	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

$jin.method({ '$jin.atom..put': function( next ){
	var config = this._config
	var merge = config.merge
	if( merge ){
		var context = config.context
		var prev = this._value
		$jin.atom.bound( function jin_atom_mergeBound( ){
			next = merge.call( context, next, prev )
		})
	}
	
	this.value( next )
	this._error = void 0
	this._pulled = false
	
	return this
}})

$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

$jin.method({ '$jin.atom..mutate': function( mutator ){
	var context = this._config.context
	var prev = this._value
	var atom = this
	
	$jin.atom.bound( function mutate( ){
		atom.put( mutator.call( context, prev ) )
	})
	
	return this
}})

$jin.method({ '$jin.atom..value': function( next ){
	var prev = this._value

	if( !arguments.length ) return prev

	if( next === prev ) return this

	this._value = next
	
	var config = this._config
	var context = config.context
	
	var error = this._error
	if( error ){
		var fail = config.fail
		if( fail ){
			$jin.atom.bound( function jin_atom_failBound( ){
				fail.call( context, error, prev )
			})
		}
	} else {
		var push = config.push
		if( push ){
			$jin.atom.bound( function jin_atom_pushBound( ){
				push.call( context, next, prev )
			})
		}
	}

	this.notify()

	return this
}})

$jin.method({ '$jin.atom..defined': function( ){
	return ( this._value !== void 0 )
}})

$jin.method({ '$jin.atom..slice': function( ){
	return this._slice
}})

$jin.method({ '$jin.atom..notify': function( ){
	var slaveExclude = $jin.atom.slaves[0]
	
	var slaves = this._slaves
	for( var id in slaves ){
		var slave = slaves[ id ]
		
		if( !slave ) continue
		if( slave === slaveExclude ) continue
		
		slave.update()
	}

	return this
}})

$jin.method({ '$jin.atom..update': function( ){
	var slice = this._slice

	var queue = $jin.atom.scheduled[ slice ]
	if( !queue ) queue = $jin.atom.scheduled[ slice ] = {}

	queue[ this._id ] = this
	this._scheduled = true

	$jin.atom.schedule()

	return this
}})

$jin.method({ '$jin.atom..lead': function( slave ){
	if( slave === this ) throw new Error( 'Self leading atom' )
	var id = slave.id()
	
	var slaves = this._slaves
	if( !slaves[ id ] ){
		slaves[ id ] = slave
		++ this._slavesCount
	}

	return this
}})

$jin.method({ '$jin.atom..obey': function( master ){
	if( master === this ) throw new Error( 'Self obey atom' )
	var id = master.id()
	
	this._masters[ id ] = master

	var masterSlice = master.slice()
	if( masterSlice >= this._slice ) this._slice = masterSlice + 1;

	return this
}})

$jin.method({ '$jin.atom..dislead': function( slave ){
	var id = slave.id()
	
	var slaves = this._slaves
	if( slaves[ id ] ){
		slaves[ id ] = void 0
		if( !-- this._slavesCount ) this.reap()
	}

	return this
}})

$jin.method({ '$jin.atom..disobey': function( master ){
	var id = master.id()

	this._masters[ id ] = void 0

	return this
}})

$jin.method({ '$jin.atom..disleadAll': function( ){
	var slaves = this._slaves
	this._slaves = {}
	this._slavesCount = 0
	for( var id in slaves ){
		slaves[ id ].disobey( this )
	}
	this.reap()
}})

$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		masters[ id ].dislead( this )
	}
	this._slice = 0
}})

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

$jin.method({ '$jin.atom..destroy': function( ){
	this.disleadAll()
	this.disobeyAll()
	if( this._scheduled ){
		var queue = $jin.atom.scheduled[ this._slice ]
		queue[ this._id ] = null
	}
	return this['$jin.klass..destroy']()
}})

$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin( '$jin.atom.logging', '$jin.atom' )
}})

$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._config.name || this._id, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function jin_atom_defferedLog( row ){
				$jin.log.apply( $jin, row )
			} )
			console.groupEnd('$jin.atom.log')
			ctor.log( [] )
		} )
	}

	return this[ '$jin.atom..notify' ]()
}})

$jin.property({ '$jin.atom.logging.log': function( ){
	return []
}})
