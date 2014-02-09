$jin.klass({ '$jin.dnd.onLeave': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onLeave.type', function( ){
    return 'dragleave'
} )
