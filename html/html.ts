module $jin.html {

    export function escape( text ) {
        return String( text )
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&apos;' )
    }

    export function decode( text ) {
        var decoder = document.createElement( 'textarea' )
        decoder.innerHTML = text
        return decoder.value
    }

    export function text( html ) {
        return $jin.html.decode(
            String( html )
            .replace( /<br[^>]*>/gi, '\n' )
            .replace( /<[^<>]+>/g, '' )
        )
    }

}
