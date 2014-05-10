/**
 * @name $jin.wrapper
 * @class $jin.wrapper
 * @returns $jin.wrapper
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.wrapper': [] })

/**
 * @name $jin.wrapper#raw
 * @method raw
 * @member $jin.wrapper
 */
$jin.property({ '$jin.wrapper..raw': null })

/**
 * @name $jin.wrapper.exec
 * @method exec
 * @static
 * @member $jin.wrapper
 */
$jin.method({ '$jin.wrapper.exec': function( obj ){
    if( obj instanceof this ) return obj
    if( obj.raw ) obj = obj.raw()
    return this['$jin.klass.exec']( obj )
}})

/**
 * @name $jin.wrapper#init
 * @method init
 * @member $jin.wrapper
 */
$jin.method({ '$jin.wrapper..init': function( obj ){
    '$jin.klass..init'
    this.raw( obj )
    return this
}})
