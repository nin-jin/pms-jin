/**
 * @name $jin.storage
 * @class $jin.storage
 * @returns $jin.storage
 * @mixins $jin.klass
 * @mixins $jin.registry
 * @mixins $jin.uri
 */
$jin.klass({ '$jin.storage': [ '$jin.registry', '$jin.uri' ] })

/**
 * @name $jin.storage#toString
 * @method toString
 * @member $jin.storage
 */
$jin.method({ '$jin.storage..toString': function( ){
    '$jin.registry..toString'
    return this['$jin.uri..toString']()
}})
