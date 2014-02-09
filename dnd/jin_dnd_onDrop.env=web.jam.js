$jin.klass({ '$jin.dnd.onDrop': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onDrop.type', function( ){
    return 'drop'
} )
