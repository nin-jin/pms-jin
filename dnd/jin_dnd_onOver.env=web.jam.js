/**
 * @name $jin.dnd.onOver
 * @class $jin.dnd.onOver
 * @returns $jin.dnd.onOver
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onOver': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onOver.type
 * @method type
 * @static
 * @member $jin.dnd.onOver
 */
$jin.method({ '$jin.dnd.onOver.type': function( ){
    this['$jin.event.type']
    return 'dragover'
}})
