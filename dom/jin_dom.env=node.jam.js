$jin.mixin({ '$jin.dom': [ '$jin.dom.nodejs' ] })
    
/**
 * @name $jin.dom.nodejs.env
 * @method env
 * @static
 * @member $jin.dom.nodejs
 */
$jin.method({ '$jin.dom.nodejs.env': function( ){
    '$jin.dom.env'
    return $node.xmldom
}})
