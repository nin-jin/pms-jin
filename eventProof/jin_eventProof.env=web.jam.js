/**
 * @name $jin.eventProof
 * @class $jin.eventProof
 * @returns $jin.eventProof
 * @mixins $jin.klass
 * @mixins $jin.event
 */
$jin.klass({ '$jin.eventProof': [ '$jin.event' ] })

/**
 * @name $jin_eventProof#scream
 * @method scream
 * @member $jin_eventProof
 */
$jin.method({ '$jin_eventProof..scream': function( crier ){
    this['$jin.event..scream']( crier )
    
    if( !this.catched() ){
        throw new Error( '[' + this + '] is not catched' )
    }
    
    return this
}})
