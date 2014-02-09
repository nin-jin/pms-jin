$jin.klass({ '$jin.onElemDrop': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.onElemDrop.type', function( ){
    return 'DOMNodeRemoved'
} )
