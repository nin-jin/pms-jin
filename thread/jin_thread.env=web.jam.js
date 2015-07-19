/**
 * @name $jin.thread
 * @method thread
 * @static
 * @member $jin
 */
$jin.method({ '$jin.thread': function( proc ){
    return function $jin_thread_wrapper( ){
        var self= this
        var args= arguments
        var res
        
        var id= $jin.makeId( '$jin.thread' )
        var launcher = function $jin_thread_launcher( event ){
            res= proc.apply( self, args )
        }
        
		if( $jin.support.eventModel() === 'w3c' ){
			window.addEventListener( id, launcher, false )
				var event= document.createEvent( 'Event' )
				event.initEvent( id, false, false )
				window.dispatchEvent( event )
			window.removeEventListener( id, launcher, false )
		} else {
			try {
				launcher()
			} catch( error ){
				$jin.log.error( error )
			}
		}
        
        return res
    }
}})

