/**
 * @name $jin.onElemDrop
 * @class $jin.onElemDrop
 * @returns $jin.onElemDrop
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.onElemDrop': [ '$jin.dom.event' ] })

/**
 * @name $jin.onElemDrop.type
 * @method type
 * @static
 * @member $jin.onElemDrop
 */
$jin.method({ '$jin.onElemDrop.type': function( ){
    this['$jin.event.type']
    return 'DOMNodeRemoved'
}})
