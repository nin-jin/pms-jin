/**
 * @name $jin.atom.prop
 * @method prop
 * @static
 * @member $jin.atom
 */
$jin.definer({ '$jin.atom.prop': function( path, config ){
    if( !config.name ) config.name = path
	
	config.clear = config.clear || function( ){
		this[ fieldName ] = null;
	}
	
    var prop = function jin_atom_prop_accessor( next ){
        var atom = propAtom.call( this )
        if( !arguments.length ) return atom.get()
        
		if( next === void 0 ){
			atom.clear()
			return this
		}
		
		var prev = atom.value()
		var next2 = config.merge ? config.merge.call( this, next, prev ) : next
		
		if( next2 === prev ) return this
		
		var next3 = config.put ? config.put.call( this, next2, prev ) : next2
		
		if( next3 !== void 0 ) atom.put( next3 )
		
        return this
    }
    
    var fieldName = '_' + path
    
    var propAtom = function jin_atom_prop_stor( ){
		var atom = this[ fieldName ]
		if( atom ) return atom
		
		config.context = this
        return this[ fieldName ] = Atom( config )
    }

	prop.jin_method_resolves = config.resolves || []
	propAtom.jin_method_resolves = prop.jin_method_resolves.map( function( path ){
		return path + '_atom'
	} )

	$jin.method( path, prop )
	$jin.method( path + '_atom', propAtom )

	// var Atom = $jin.klass( path + '.atom', [ '$jin.atom.variable' ] ) // very slow init
	var Atom = $jin.atom.subClass({})
	
	Atom.prototype._name = path
	
	if( config.get ){
		config.get.displayName = path + '.get'
		Atom.prototype._get = config.get
		$jin.mixin( Atom, [ '$jin.atom.getable' ] )
	}
	
	if( config.pull ){
		config.pull.displayName = path + '.pull'
		Atom.prototype._pull = config.pull
		$jin.mixin( Atom, [ '$jin.atom.pullable' ] )
	}
	
	if( config.clear ){
		config.clear.displayName = path + '.clear'
		Atom.prototype._clear = config.clear
		$jin.mixin( Atom, [ '$jin.atom.clearable' ] )
	}
	
	if( config.push ){
		config.push.displayName = path + '.push'
		Atom.prototype._push = config.push
		$jin.mixin( Atom, [ '$jin.atom.pushable' ] )
	}
	
	if( config.fail ){
		config.push.displayName = path + '.fail'
		Atom.prototype._fail = config.fail
		$jin.mixin( Atom, [ '$jin.atom.failable' ] )
	}
	
	if( config.merge ){
		config.merge.displayName = path + '.merge'
		Atom.prototype._merge = config.merge
		$jin.mixin( Atom, [ '$jin.atom.mergable' ] )
	}
	
    return prop
}})

/**
 * @name $jin.atom.prop.list
 * @method list
 * @static
 * @member $jin.atom.prop
 */
$jin.definer({ '$jin.atom.prop.list': function( path, config ){
	var baseMerge = config.merge
	config.merge = function( next, prev ){
		if( !next ) return next
		
		if( baseMerge ){
			next = baseMerge.call( this, next, prev )
			if( next === prev ) return next;
		}
		
		if( !prev ) return next
		if( $jin.list.isEqual( next, prev ) ) return prev
		
		return next
	}
	
	$jin.atom.prop( path, config )
	
	var propName = path.replace( /([$\w]*\.)+/, '' )
	
	var add = function( newItems ){
        var items = this[ propName + '_atom' ]().value() || []
        
		if( config.merge ) newItems = config.merge.call( this, newItems )
		
        newItems = newItems.filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
	}
	add.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_add'
	} )
	$jin.method( path + '_add', add )
	
	var drop = function( dropItems ){
		var items = this[ propName + '_atom' ]().value() || []
        
		if( config.merge ) dropItems = config.merge.call( this, dropItems )
		
        items = items.filter( function( item ){
            return dropItems.indexOf( item ) === -1
        })
        
        this[propName]( items )
		
		return this
    }
	drop.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_drop'
	} )
	$jin.method( path + '_drop', drop )

	var has = function( item ){
		if( config.merge ) item = config.merge.call( this, [ item ] )[ 0 ]
		var items = this[propName]()
		if( !items ) return items
        
        return items.indexOf( item ) >= 0 
    }
	has.jin_method_resolves = ( config.resolves || [] ).map( function( path ){
		return path + '_has'
	} )
	$jin.method( path + '_has', has )
	
}})

/**
 * @name $jin.atom.prop.hash
 * @method hash
 * @static
 * @member $jin.atom.prop
 */
$jin.definer({ '$jin.atom.prop.hash': function( path, config ){
    
	var pull = config.pull
	var put = config.put
	var push = config.push
	var merge = config.merge
	
    var prop = function( key, next ){
        var atom = prop.atom( this, key )
        
        if( arguments.length < 2 ) return atom.get()
        
		var prev = atom.value()
		if( merge ) next = merge.call( this, key, next, prev )
		
        if( put && ( next !== prev ) ) next = put.call( this, key, next, prev )
		
		if( next === void 0 ) atom.clear()
		else atom.put( next )
		
		return this;
    }
    
    var fieldName = fieldName = '_' + path
    
    prop.atomHash = function( context ){
        var atomHash = context[ fieldName ]
        if( !atomHash ) atomHash = context[ fieldName ] = {}
        return atomHash
    }
    
    prop.atom = function( context, key ){
        var atomHash = prop.atomHash( context )
        
        var atom = atomHash[ key ]
        if( atom ) return atom
        
        return atomHash[ key ] = $jin.atom(
		{	name: path + ':' + key /* + ':' + this.id()*/
		,	context: context
		,	pull: pull && function( prev ){
				return pull.call( context, key, prev )
			}
		,	push: push && function( next, prev ){
				return push.call( context, key, next, prev )
			}
		,	merge: merge
		} )
    }

	$jin.method( path, prop )

	$jin.method( path + '_atom', function( key ){
		return prop.atom( this, key )
    } )
	
	$jin.method( path + '_clear', function( ){
		var atomHash = this[ fieldName ]
		for( var key in atomHash ) atomHash[ key ].clear()
    } )
	
    return prop
}})
