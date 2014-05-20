/**
 * @name $jin.dom.event.onChange
 * @class $jin.dom.event.onChange
 * @returns $jin.dom.event.onChange
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onChange': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onChange.type
 * @method type
 * @static
 * @member $jin.dom.event.onChange
 */
$jin.method({ '$jin.dom.event.onChange.type': function( ){
    this['$jin.event.type']
    return 'change'
}})
