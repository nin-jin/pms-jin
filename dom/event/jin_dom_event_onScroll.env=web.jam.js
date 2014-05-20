/**
 * @name $jin.dom.event.onScroll
 * @class $jin.dom.event.onScroll
 * @returns $jin.dom.event.onScroll
 * @mixins $jin.klass
 * @mixins $jin.dom.event
 */
$jin.klass({ '$jin.dom.event.onScroll': [ '$jin.dom.event' ] })

/**
 * @name $jin.dom.event.onScroll.type
 * @method type
 * @static
 * @member $jin.dom.event.onScroll
 */
$jin.method({ '$jin.dom.event.onScroll.type': function( ){
    this['$jin.event.type']
    return 'scroll'
}})
