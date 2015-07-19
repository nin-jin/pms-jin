module $jin.crypt {

    export function hash( value : string ) {
        var hash = $node.crypto.createHash( 'sha256' )
        hash.update( value )
        return $node.base32.encode( hash.digest() )
    }

    export function key( ) {
        return $node.base32.encode( $node.crypto.randomBytes( 32 ) )
    }

}