$jin.definer({ '$jin.atom.prop': function( path, config ){
    
	var pull = config.pull
	if( pull && !pull.displayName ) pull.displayName = path + '.pull'

	var put = config.put
	if( put && !put.displayName ) put.displayName = path + '.put'

	var push = config.push
	if( push && !push.displayName ) push.displayName = path + '.push'

	var merge = config.merge
	if( merge && !merge.displayName ) merge.displayName = path + '.merge'

    var prop = function jin_atom_prop_accessor( next ){
        var atom = propAtom.call( this )
        if( !arguments.length ) return atom.get()
        
		var prev = atom.value()
		var next2 = merge ? merge.call( this, next, prev ) : next
		
		var next3 = ( put && ( next2 !== prev ) ) ? put.call( this, next2, prev ) : next2
		
        atom.put( next3 )
		
        return this
    }
    
    var fieldName = '_' + path
    
    var propAtom = function jin_atom_prop_stor( ){
        var atom = this[ fieldName ]
        
        if( atom ) return atom
        
        return this[ fieldName ] = new $jin.atom(
		{	name: path /*+ ':' + this.id()*/
		,	context: this
		,	pull: pull
		,	push: push
		,	merge: merge
		,	value: config.value
		} )
    }

	prop.jin_method_resolves = config.resolves || []
	propAtom.jin_method_resolves = prop.jin_method_resolves.map( function( path ){
		return path + '_atom'
	} )

	$jin.method( path, prop )
	$jin.method( path + '_atom', propAtom )

    return prop
}})

$jin.definer({ '$jin.atom.prop.list': function( path, config ){
	if( !config.merge ) config.merge = function( next, prev ){
		if( !prev || !next ) return next
		
		if( next.length !== prev.length ) return next
		
		for( var i = 0; i < next.length; ++i ){
			if( next[ i ] === prev[ i ] ) continue
			return next
		}
		
		return prev
	}
	
	$jin.atom.prop( path, config )
	
	var propName = path.replace( /([$\w]*\.)+/, '' )
	
	$jin.method( path + '_add', function( newItems ){
        var items = this[propName]() || []
        
		if( config.merge ) newItems = config.merge.call( this, newItems )
		
        newItems = newItems.filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
	} )
	
	$jin.method( path + '_drop', function( oldItems ){
		var items = this[propName]() || []
        
		if( config.merge ) oldItems = config.merge.call( this, oldItems )
		
        items = items.filter( function( item ){
            return !~oldItems.indexOf( item )
        })
        
        this[propName]( items )
		
		return this
    } )
	
	$jin.method( path + '_has', function( item ){
		if( config.merge ) item = config.merge.call( this, [ item ] )[ 0 ]
		var items = this[propName]()
		if( !items ) return items
        
        return items.indexOf( item ) >= 0 
    } )
	
}})

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
		atom.value( next )
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
        
        return atomHash[ key ] = new $jin.atom(
		{	name: path/* + ':' + this.id()*/
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

    return prop
}})
