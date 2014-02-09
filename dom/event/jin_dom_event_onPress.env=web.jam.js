$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

$jin.method( '$jin.event.type', '$jin.dom.event.onPress.type', function( ){
    return 'keydown'
} )
