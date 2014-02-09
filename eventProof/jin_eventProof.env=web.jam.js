$jin.mixin( '$jin.event', '$jin.eventProof' )

$jin.method( '$jin.event..scream', '$jin_eventProof..scream', function( crier ){
    this['$jin.event..scream']( crier )
    
    if( !this.catched() ){
        throw new Error( '[' + this + '] is not catched' )
    }
    
    return this
} )
