$jin.mixin({ '$jin.dom': [ '$jin.dom.nodejs' ] })
    
$jin.method( '$jin.dom.env', '$jin.dom.nodejs.env', function( ){
    return $node.xmldom
} )
