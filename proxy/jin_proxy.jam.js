$jin.proxy = function( handler ){

    if( typeof Proxy === 'undefined' )
        throw new Error( 'Can not find Proxy API. In node.js use --harmony flag to enable.' )

    if( typeof Proxy === 'function' ) return function( target ){
        return new Proxy( Object( target ), handler )
    }
    
    var oldTraps= new function( ){
        
        this.getOwnPropertyDescriptor=
        this.getPropertyDescriptor=
        function( name ){
            if( handler.getOwnPropertyDescriptor ) return handler.getOwnPropertyDescriptor( this.valueOf(), name )
            return Object.getOwnPropertyDescriptor( this.valueOf(), name )
        }
        
        this.getOwnPropertyNames=
        function( ){
            return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( this.valueOf() )
        }
        
        this.defineProperty=
        function( name, descriptor ){
            return ( handler.getOwnPropertyNames || Object.getOwnPropertyNames )( this.valueOf(), name, descriptor )
        }
        
        this.delete=
        function( name ){
            return handler.deleteProperty ? handler.deleteProperty( this.valueOf(), name ) : delete this.valueOf()[ name ]
        }
        
        this.fix=
        function( ){
            throw new Error( '"fix" trap is unsupported for this proxy' )
        }
        
        this.has=
        function( name ){
            return handler.has ? handler.has( this.valueOf(), name ) : name in this.valueOf()
        }
        
        this.hasOwn=
        function( name ){
            return handler.hasOwn ? handler.hasOwn( this.valueOf(), name ) : this.valueOf().hasOwnProperty( name )
        }
        
        this.get=
        function( receiver, name ){
            if( handler.get ) return handler.get( this.valueOf(), name, receiver )
            
            if( name === 'valueOf' ) return this.valueOf
            if( name === 'toString' ) return function(){ return String( this.valueOf() ) }
            //if( name === 'inspect' ) return function(){ return $ node.util.inspect( this.valueOf() ) }
            if( this.valueOf() == null ) return null
            
            return this.valueOf()[ name ]
        }
        
        this.set=
        function( receiver, name, value ){
            if( handler.set ) return handler.set( this.valueOf(), name, value, receiver )
            
            this.valueOf()[ name ]= value
            return this.valueOf()[ name ] === value
        }
        
        this.enumerate=
        function( ){
            if( handler.enumerate ) return handler.enumerate( this.valueOf() )
            
            var names= []
            for( var name in this.valueOf() ) names.push( name )
            return names
        }
        
        this.keys=
        function( ){
            if( handler.keys ) return handler.keys( valueOf )
            
            return Object.keys( Object( this.valueOf() ) )
        }
        
        this.valueOf= null
        
    }
    
    return function( target ){
        target= target && target.valueOf()
        var valueOf=
        function( ){
            return handler.hasOwnProperty( 'valueOf' ) ? handler.valueOf( target ) : target
        }
        
        var traps= Object.create( oldTraps )
        traps.valueOf= valueOf
        return Proxy.createFunction
        (   traps
        ,   function( ){
                return handler.apply ? handler.apply( valueOf(), this, arguments ) : valueOf().apply( this, arguments )
            }
        ,   function( ){
                if( handler.construct ) return handler.construct( valueOf(), arguments )
                
                var obj= Object.create( valueOf().prototype )
                var res= valueOf().apply( obj, arguments )
                
                return Object( ( res == null ) ? obj : res )
            }
        )
    }

}
