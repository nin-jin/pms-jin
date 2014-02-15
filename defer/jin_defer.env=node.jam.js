$jin.method({ '$jin.defer': function( func ){
    process.nextTick( function( ){
        if( func ) func()
    } )
    return { destroy: function( ){
        func = null
    } }
}})
