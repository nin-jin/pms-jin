/**
 * @name $jin.storage.mongo
 * @class $jin.storage.mongo
 * @returns $jin.storage.mongo
 * @mixins $jin.klass
 * @mixins $jin.storage
 */
$jin.klass({ '$jin.storage.mongo': [ '$jin.storage' ] })

/**
 * @name $jin.storage.mongo#driver
 * @method driver
 * @member $jin.storage.mongo
 */
$jin.property({ '$jin.storage.mongo..driver': function( ){
    return $jin.async2sync( $node.mongodb.MongoClient.connect )( this + '' )
}})

/**
 * @name $jin.storage.mongo#collection
 * @method collection
 * @member $jin.storage.mongo
 */
$jin.method({ '$jin.storage.mongo..collection': function( name ){
    return $jin.storage.mongo.collection( this.driver.collection( name ) )
}})
