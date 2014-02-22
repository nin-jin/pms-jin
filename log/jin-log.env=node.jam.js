$jin.method({ '$jin.log' : function( ){
	var args = [].slice.call( arguments )
	
	var out = $jin.log.prefix( 1 )
	out = out.concat( $jin.log.inspects( args ) )
	
	console.log.apply( console, out )
	
	return $jin.log
}})

$jin.method({ '$jin.log.info' : function( ){
	var args = [].slice.call( arguments )
	var message = args.shift()
	
	var out = this.prefix( 1 )
	out.push( message )
	out = out.concat( this.inspects( args ) )
	
	console.info.apply( console, out )
	
	return this
}})

$jin.method({ '$jin.log.warn' : function( ){
	var args = [].slice.call( arguments )
	var message = args.shift()
	
	var out = this.prefix( 1 )
	out.push( $node.colors.cyan( message ) )
	out = out.concat( this.inspects( args ) )
	
	console.warn.apply( console, out )
	
	return this
}})

$jin.method({ '$jin.log.error' : function( ){
	for( var i = 0; i < arguments.length; ++i ){
		var error = arguments[ i ]
		if( error.jin_log_isLogged ) continue
		
		var out = this.prefix( 1 )
		
		var message = String( error )
		var stack = error.stack && String( error.stack ).split( message + '\n' ).join( '' )
		if( stack ) message += '\n' + stack
		out.push( $node.colors.bold( $node.colors.red( message ) ) )
		
		console.error.apply( console, out )
		
		error.jin_log_isLogged = true
	}
	
	return this
}}) 

$jin.method({ '$jin.log.inspects' : function( values ){
	var out = []
	for( var i = 0; i < values.length; ++i ){
		out.push( $node.util.inspect( values[ i ], { colors: true } ) )
	}
	return out
}})

$jin.method({ '$jin.log.prefix' : function( level ){
	var out = []
	out.push( $node.colors.grey( ( new Date ).toTimeString().replace( / .*/, '' ) )  )
	out.push( $node.colors.grey( this.funcNameAt( level + 1 ) ) )
	return out
}})

$jin.method({ '$jin.log.funcNameAt' : function( level ){
	var caller = arguments.callee
	for( var i = 0; i <= level; ++i ) caller = caller.caller
	
	var name = caller.jin_method_path
	if( name ) return name
	
	var stackCurrent = ( new Error ).stack.split( '\n' ).slice( 2 + level )[ 0 ]
	// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	var parsed = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi.exec( stackCurrent ) || /at\s+()(.*):(\d*):(\d*)/gi.exec( stackCurrent )
	if( parsed ) return parsed[ 1 ]
	
	return '(unknown function)'
}}) 
