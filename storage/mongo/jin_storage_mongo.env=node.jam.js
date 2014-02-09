$jin.klass({ '$jin.storage.mongo': [ '$jin.storage' ] })

$jin.property( '$jin.storage.mongo..driver', function( ){
    return $jin.async2sync( $node.mongodb.MongoClient.connect )( this + '' )
} )

$jin.method( '$jin.storage.mongo..collection', function( name ){
    return $jin.storage.mongo.collection( this.driver.collection( name ) )
} )
