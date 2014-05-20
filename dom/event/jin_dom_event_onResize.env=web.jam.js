/**
 * @name $jin.dom.event.onResize
 * @class $jin.dom.event.onResize
 * @returns $jin.dom.event.onResize
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onResize': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onResize.type
 * @method type
 * @static
 * @member $jin.dom.event.onResize
 */
$jin.method({ '$jin.dom.event.onResize.type': function( ){
    this['$jin.event.type']
    return 'resize'
}})
