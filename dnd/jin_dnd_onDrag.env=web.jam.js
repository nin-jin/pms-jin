$jin.klass({ '$jin.dnd.onDrag': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onDrag.type', function( ){
    return 'drag'
} )
