$jin.klass({ '$jin.dnd.onEnd': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onEnd.type', function( ){
    return 'dragleave'
} )
