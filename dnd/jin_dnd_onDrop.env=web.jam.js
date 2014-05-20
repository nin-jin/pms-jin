/**
 * @name $jin.dnd.onDrop
 * @class $jin.dnd.onDrop
 * @returns $jin.dnd.onDrop
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onDrop': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onDrop.type
 * @method type
 * @static
 * @member $jin.dnd.onDrop
 */
$jin.method({ '$jin.dnd.onDrop.type': function( ){
    this['$jin.event.type']
    return 'drop'
}})
