/**
 * @name $jin.dom.event.onDoubleClick
 * @class $jin.dom.event.onDoubleClick
 * @returns $jin.dom.event.onDoubleClick
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onDoubleClick': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onDoubleClick.type
 * @method type
 * @static
 * @member $jin.dom.event.onDoubleClick
 */
$jin.method({ '$jin.dom.event.onDoubleClick.type': function( ){
    this['$jin.event.type']
    return 'dblclick'
}})
