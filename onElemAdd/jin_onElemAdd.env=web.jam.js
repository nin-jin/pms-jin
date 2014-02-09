$jin.klass({ '$jin.onElemAdd': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.onElemAdd.type', function( ){
    return 'DOMNodeInserted'
} )
