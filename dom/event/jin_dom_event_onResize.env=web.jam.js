$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onResize.type', function( ){
    return 'resize'
} )
