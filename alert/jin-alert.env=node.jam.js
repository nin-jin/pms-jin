$jin.alert = $jin.async2sync( function jin_alert( message, done ){
	$jin.log.info( message )
	
	var rawMode = process.stdin.isRaw
	process.stdin.setRawMode( true )
	
	process.stdin.resume()
	process.stdin.once( 'data', function jin_alert_handle_press( data ){
		
		process.stdin.pause()
		process.stdin.setRawMode( rawMode )
		
		done( null, data )
	} )
} )
