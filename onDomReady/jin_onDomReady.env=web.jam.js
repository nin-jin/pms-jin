/**
 * @name $jin.onDomReady
 * @class $jin.onDomReady
 * @returns $jin.onDomReady
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.onDomReady': [ '$jin.dom.event' ] })

/**
 * @name $jin.onDomReady.type
 * @method type
 * @static
 * @member $jin.onDomReady
 */
$jin.method({ '$jin.onDomReady.type': function( ){
    '$jin.event.type'
    return 'DOMContentLoaded'
}})
