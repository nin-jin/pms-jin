this.$jin.path=
function( axis ){

    var cache= {}
    
    var tokens= Object.keys( axis ).join( '' )
    
    var lexer= RegExp( '([' + tokens + ']?)\s*([^' + tokens + '\\s]*)', 'g' )
    
    return function( path ){
        var result= cache[ path ]
        if( result ) return result
        
        var processors= []
        path.replace
        (   lexer
        ,   function( str, type, name ){
                if( !str ) return
                processors.push( axis[ type || '' ]( name ) )
            }
        )
        
        return cache[ path ]= function( value ){
            return processors.reduce( function( val, proc ){
                return proc( val )
            }, value )
        }
    }

}
