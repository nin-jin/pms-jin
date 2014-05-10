/**
 * @name $jin.dom.event.onWheel
 * @class $jin.dom.event.onWheel
 * @returns $jin.dom.event.onWheel
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onWheel': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onWheel.type
 * @method type
 * @static
 * @member $jin.dom.event.onWheel
 */
$jin.method({ '$jin.dom.event.onWheel.type': function( ){
    '$jin.event.type'
    return 'wheel'
}})
