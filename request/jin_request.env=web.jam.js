$jin.request = function( options ){
    var xhr = new XMLHttpRequest
	var body = options.body
	if( $jin_type( body ) === 'Object' ){
		var form = new FormData
		for( var key in body ){
			form.append( key, body[ key ] )
		}
		body = form
	}
	xhr.withCredentials = true
	if( options.responseType ) {
		xhr.responseType = options.responseType
	}
	xhr.open( options.method || 'GET', options.uri, !options.sync )
	if( options.headers ) {
		for( var name in options.headers ) {
			options.headers[ name].forEach( function( value ) {
				xhr.setRequestHeader( name , value )
			})
		}
	}
	if( options.sync ){
		if( options.type ) xhr.setRequestHeader( 'Content-Type', options.type )
		xhr.send( body )
		return xhr
	} else {
		var atom = new $jin.atom.prop({ name: '$jin.request:' + options.uri })
		if( options.type ) xhr.setRequestHeader( 'Content-Type', options.type )
		xhr.onload = function( ){
			atom.push( xhr )
		}
		xhr.onerror = function( ){
			atom.fail( xhr )
		}
		xhr.send( body )
		return atom
	}
}
