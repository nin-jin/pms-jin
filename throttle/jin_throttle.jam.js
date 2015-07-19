this.$jin.throttle=
function( timeout, func ){
    var timer = null
    return function( ){
        if( timer ) timer = clearTimeout( timer )
        
        var self = this
        var args = arguments
        
        timer = setTimeout( function( ){
            func.apply( self, args )
        }, timeout )
    }
}

