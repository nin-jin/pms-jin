/**
 * @name $jin.dom.event.onPress
 * @class $jin.dom.event.onPress
 * @returns $jin.dom.event.onPress
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onPress': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onPress.type
 * @method type
 * @static
 * @member $jin.dom.event.onPress
 */
$jin.method({ '$jin.dom.event.onPress.type': function( ){
    '$jin.event.type'
    return 'keydown'
}})
