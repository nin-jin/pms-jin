/**
 * @name $jin.dom.event.onClick
 * @class $jin.dom.event.onClick
 * @returns $jin.dom.event.onClick
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onClick': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onClick.type
 * @method type
 * @static
 * @member $jin.dom.event.onClick
 */
$jin.method({ '$jin.dom.event.onClick.type': function( ){
    this['$jin.event.type']
    return 'click'
}})
