/**
 * @name $jin.listener
 * @class $jin.listener
 * @returns $jin.listener
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.listener': [] })

/**
 * @name $jin.listener#crier
 * @method crier
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..crier': null })

/**
 * @name $jin.listener#eventName
 * @method eventName
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..eventName': String })

/**
 * @name $jin.listener#handler
 * @method handler
 * @member $jin.listener
 */
$jin.property({ '$jin.listener..handler': null })

$jin.method( '$jin.listener..forget', function( ){
    this.crier().forget( this.eventName(), this.handler() )
    return this
} )

/**
 * @name $jin.listener#destroy
 * @method destroy
 * @member $jin.listener
 */
$jin.method({ '$jin.listener..destroy': function( ){
    this.forget()
    this['$jin.klass..destroy']()
}})
