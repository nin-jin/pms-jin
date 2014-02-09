$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onClick.type', function( ){
    return 'click'
} )
