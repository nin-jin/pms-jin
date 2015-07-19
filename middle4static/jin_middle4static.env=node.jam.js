this.$jin.middle4static =
function( ){
    return $node.express.static
    (   $node.path.resolve()
    ,   { maxAge: 1000 * 60 * 60 * 24 * 365 * 1000 }
    )
}