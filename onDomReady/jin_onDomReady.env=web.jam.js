$jin.klass({ '$jin.onDomReady': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.onDomReady.type', function( ){
    return 'DOMContentLoaded'
} )
