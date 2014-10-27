module $jin.crypt {

    export function hash( value : string ) {
        var hash = $node.crypto.createHash( 'sha256' )
        hash.update( value )
        return hash.digest( 'base64' )
    }

    export function key( ) {
        return $node.crypto.randomBytes( 32 ).toString( 'base64' )
    }

}