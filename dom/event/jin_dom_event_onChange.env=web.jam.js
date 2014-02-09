$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onChange.type', function( ){
    return 'change'
} )
