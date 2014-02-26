$jin.klass({ '$jin.storage': [ '$jin.registry', '$jin.uri' ] })

$jin.method( '$jin.uri..toString', '$jin.registry..toString', '$jin.storage..toString', function( ){
    return this['$jin.uri..toString']()
} )
