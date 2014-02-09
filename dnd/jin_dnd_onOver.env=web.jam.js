$jin.klass({ '$jin.dnd.onOver': [ '$jin.dnd.event' ] })

$jin.method( '$jin.event.type', '$jin.dnd.onOver.type', function( ){
    return 'dragover'
} )
