/**
 * @name $jin.onElemAdd
 * @class $jin.onElemAdd
 * @returns $jin.onElemAdd
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.onElemAdd': [ '$jin.dom.event' ] })

/**
 * @name $jin.onElemAdd.type
 * @method type
 * @static
 * @member $jin.onElemAdd
 */
$jin.method({ '$jin.onElemAdd.type': function( ){
    '$jin.event.type'
    return 'DOMNodeInserted'
}})
