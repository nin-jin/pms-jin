$jin.mixin( '$jin.dom.nodejs', '$jin.dom' )
    
$jin.method( '$jin.dom.env', '$jin.dom.nodejs.env', function( ){
    return $node.xmldom
} )
