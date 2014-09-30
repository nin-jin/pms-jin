$jin.request = function( options ){
    var xhr = new XMLHttpRequest
	var body = options.body
	if( $jin.type( body ) === 'Object' ){
		var form = new FormData
		for( var key in body ){
			form.append( key, body[ key ] )
		}
		body = form
	}
	xhr.withCredentials = true
	if( options.sync ){
		xhr.open( options.method || 'GET', options.uri, false )
		xhr.send( body )
		return xhr
	} else {
		var atom = $jin.atom({ name: '$jin.request:' + options.uri })
		xhr.open( options.method || 'GET', options.uri, true )
		xhr.onload = function( ){
			atom.put( xhr )
		}
		xhr.onerror = function( ){
			atom.fail( xhr )
		}
		xhr.send( body )
		return atom
	}
}
