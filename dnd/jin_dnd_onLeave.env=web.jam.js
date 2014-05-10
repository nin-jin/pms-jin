/**
 * @name $jin.dnd.onLeave
 * @class $jin.dnd.onLeave
 * @returns $jin.dnd.onLeave
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onLeave': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onLeave.type
 * @method type
 * @static
 * @member $jin.dnd.onLeave
 */
$jin.method({ '$jin.dnd.onLeave.type': function( ){
    '$jin.event.type'
    return 'dragleave'
}})
