$jin.klass({ '$jin.atom': [] })

$jin.atom.slaves = []
$jin.atom.scheduled = []
$jin.atom._deferred = null

$jin.glob( '$jin.atom.._value', void 0 )
$jin.glob( '$jin.atom.._error', void 0 )
$jin.glob( '$jin.atom.._slice', 0 )
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

			atom.pull( true )

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

$jin.method({ '$jin.atom..init': function $jin_atom__init( config ){
	this['$jin.klass..init']
	this._id = $jin.makeId( '$jin.atom' )
	this._name = config.name || this._id
	this._slaves = {}
	this._masters = {}
	if( config.pull ) this._pull = config.pull
	if( config.push ) this._push = config.push
	if( config.merge ) this._merge = config.merge
	if( config.fail ) this._fail = config.fail
	this._value = config.value
	this._context = config.context
}})

$jin.method({ '$jin.atom..id': function( ){
	return this._id
}})

$jin.method({ '$jin.atom..get': function( ){
	var slave = $jin.atom.slaves[0]
	if( slave ){
		slave.obey( this )
		this._slaves[ slave.id() ] = slave
	}
	
	if( this._pull && ( this._scheduled || ( this._value === void 0 ) ) ) this.pull()

	if( this._error ) throw this._error
	
	return this._value
}})

$jin.method({ '$jin.atom..valueOf': function( ){
	return this.get()
}})

$jin.method({ '$jin.atom..pull': function( skipUnScheduling  ){
	if( !skipUnScheduling && this._scheduled ){
		var queue = $jin.atom.scheduled[ this._slice ]
		queue[ this._id ] = null
		this.scheduled = false
	}
	
	this._error = void 0
	
	var oldMasters = this._masters
	this._masters = {}
	this._slice = 0

	if( ~$jin.atom.slaves.indexOf( this ) ) throw new Error( 'Recursive atom' )
	$jin.atom.slaves.unshift( this )
	try {
		this.put( this._pull ? this._pull.call( this._context, this._value ) : this._value )
	} catch( error ){
		this.put( null )
		this._error = error
	} finally {
		var stack = $jin.atom.slaves
		while( stack.length ){
			var top = stack.shift()
			if( top === this ) break
		}
	}

	for( var masterId in oldMasters ){
		if( this._masters[ masterId ] ) continue
		oldMasters[ masterId ].dislead( this )
	}

	return this._value
}})

$jin.method({ '$jin.atom..put': function( next ){
	
	var merge = this._merge
	if( merge ){
		var context = this._context
		var prev = this._value
		$jin.atom.bound( function mutate( ){
			next = merge.call( context, next, prev )
		})
	}
	
	this.value( next )
	this._error = void 0
	
	return this
}})

$jin.method({ '$jin.atom..fail': function( error ){
	this._error = error
	this.value( null )
	return this
}})

$jin.method({ '$jin.atom..mutate': function( mutator ){
	var context = this._context
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
	
	var context = this._context
	
	var error = this._error
	if( error ){
		var fail = this._fail
		if( fail ){
			$jin.atom.bound( function( ){
				fail.call( context, error, prev )
			})
		}
	} else {
		var push = this._push
		if( push ){
			$jin.atom.bound( function( ){
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
	if( $jin.atom.logger ) $jin.atom.log.push( this._name, value )

	for( var id in this._slaves ){
		var slave = this._slaves[ id ]
		if( !slave ) continue
		slave.update()
	}

	//this._slaves = {}

	return this
}})

$jin.method({ '$jin.atom..update': function( slice, atom ){
	var slice = this._slice

	var queue = $jin.atom.scheduled[ slice ]
	if( !queue ) queue = $jin.atom.scheduled[ slice ] = {}

	queue[ this._id ] = this

	$jin.atom.schedule()

	return this
}})

$jin.method({ '$jin.atom..lead': function( slave ){
	if( slave === this ) throw new Error( 'Self leading atom' )
	var id = slave.id()

	this._slaves[ id ] = slave

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

	this._slaves[ id ] = void 0

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
	for( var id in slaves ){
		slaves[ id ].disobey( this )
	}
}})

$jin.method({ '$jin.atom..disobeyAll': function( ){
	var masters = this._masters
	this._masters = {}
	for( var id in masters ){
		masters[ id ].dislead( this )
	}
	this._slice = 0
}})

$jin.method({ '$jin.atom..destroy': function( ){
	this.disobeyAll()
	this.disleadAll()
	return $jin.method['$jin.klass..destroy']()
}})

$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin( '$jin.atom.logging', '$jin.atom' )
}})

$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._name, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function( row ){
				console.log.apply( console, row )
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
