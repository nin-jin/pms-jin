/**
 * @name $jin.dom.event.onBlur
 * @class $jin.dom.event.onBlur
 * @returns $jin.dom.event.onBlur
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onBlur': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onBlur.type
 * @method type
 * @static
 * @member $jin.dom.event.onBlur
 */
$jin.method({ '$jin.dom.event.onBlur.type': function( ){
    '$jin.event.type'
    return 'blur'
}})
