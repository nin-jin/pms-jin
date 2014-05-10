/**
 * @name $jin.dnd.onEnter
 * @class $jin.dnd.onEnter
 * @returns $jin.dnd.onEnter
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onEnter': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onEnter.type
 * @method type
 * @static
 * @member $jin.dnd.onEnter
 */
$jin.method({ '$jin.dnd.onEnter.type': function( ){
    '$jin.event.type'
    return 'dragenter'
}})
