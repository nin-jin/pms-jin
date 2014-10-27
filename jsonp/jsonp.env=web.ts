module $jin.jsonp {
    export function fetch( uri ) {
        var promise = new $jin.atom.prop({})
        var id = '_jin_jsonp_' + Math.random().toString( 32 ).substring( 2 ).toUpperCase()
        window[ id ] = function( data ) {
            if( script.parentNode ) script.parentNode.removeChild( script )
            delete window[ id ]
            promise.push( data )
        }
        var script = document.createElement( 'script' )
        script.src = uri + id
        document.head.appendChild( script )
        return promise
    }
}