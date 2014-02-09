$jin.klass({ '$jin.dnd.onEnter': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onEnter.type', function( ){
    return 'dragenter'
} )
