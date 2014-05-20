/**
 * @name $jin.dnd.onDrag
 * @class $jin.dnd.onDrag
 * @returns $jin.dnd.onDrag
 * @mixins $jin.klass
 * @mixins $jin.dnd.event
 */
$jin.klass({ '$jin.dnd.onDrag': [ '$jin.dnd.event' ] })

/**
 * @name $jin.dnd.onDrag.type
 * @method type
 * @static
 * @member $jin.dnd.onDrag
 */
$jin.method({ '$jin.dnd.onDrag.type': function( ){
    this['$jin.event.type']
    return 'drag'
}})
