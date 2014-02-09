$jin.klass({ '$jin.model.klass': [ '$jin.registry' ] })

$jin.method( '$jin.model.klass..state', function( ){
    return $jin.state.local.item.apply( $jin.state.local, arguments )
} )

$jin.method( '$jin.model.prop', function( config ){
    var parse = config.parse || function( val ){ return val }
    var serial = config.parse || String
    
    var prop = $jin.atom.prop( config.name,
    {   pull: function( ){
            var val = this.state( config.name + '=' + this )
            if( val === null ) val = config.def
            val = parse.call( this, val )
            return ( val === void 0 ) ? null : val
        }
    ,   put: function( val, old ){
            if( val != null ) val = String( serial.call( this, val ) )
            this.state( config.name + '=' + this, val )
            return old
        }
    } )
    
    return prop
} )

$jin.method( '$jin.model.list', function( config ){
    
    var propName = config.name.match( /[a-z0-9]+$/i )[0]
    
    var parseItem = config.parseItem || function( val ){ return val }
    var parse = config.parse || function( val ){
		if( typeof val === 'string' ) val = val ? val.split( ',' ) : []
        return val ? val.map( parseItem, this ) : []
    }
    
    var serialItem = config.serialItem || String
    var serial = config.serial || function( val ){
        return ( typeof val === 'string' ) ? val : val.map( serialItem, this ).join( ',' )
    }
    
    $jin.model.prop(
    {   name: config.name
    ,   parse: parse
    ,   serial: serial
    ,   def: config.def
    } )
    
    $jin.method( config.name + 'Add', function( newItems ){
        var items = this[propName]()
        
        newItems = parse( newItems ).filter( function( item ){
            return !~items.indexOf( item )
        })
        
        items = items.concat( newItems )
        this[propName]( items )
		
		return this
    })

    $jin.method( config.name + 'Drop', function( oldItems ){
        oldItems = parse( oldItems )
        
        var items = this[propName]().filter( function( item ){
            return !~oldItems.indexOf( item )
        })
        
        this[propName]( items )
		
		return this
    })
    
} )
