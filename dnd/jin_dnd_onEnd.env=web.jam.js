/**
 * @name $jin.dnd.onEnd
 * @class $jin.dnd.onEnd
 * @returns $jin.dnd.onEnd
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onEnd': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onEnd.type
 * @method type
 * @static
 * @member $jin.dnd.onEnd
 */
$jin.method({ '$jin.dnd.onEnd.type': function( ){
    this['$jin.event.type']
    return 'dragend'
}})
