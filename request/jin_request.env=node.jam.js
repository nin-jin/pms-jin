$jin.request = function( options ){
    return $jin.async2defer( $node.request )( options )
}
