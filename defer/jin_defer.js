$jin.defer = function( func ){
    $jin.defer.queue.push( func )
    if( !$jin.defer.scheduled ) $jin.defer.schedule()
    return { destroy: function(){
        var index = $jin.defer.queue.indexOf( func )
        if( ~index ) $jin.defer.queue.splice( index, 1 )
    }}
}

$jin.defer.queue = []
$jin.defer.scheduled = false

$jin.defer.schedule = function( ){
	if( typeof postMesasge === 'function' ) postMessage( '$jin.defer', document.location.href )
	else $jin.schedule( 0, $jin.defer.check )
	$jin.defer.scheduled = true
}

$jin.defer.check = function( event ){
	if( event ){
		if( event.data !== '$jin.defer' ) return
	}
	
	while( $jin.defer.queue.length ){
		var queue = $jin.defer.queue
		$jin.defer.queue = []
		
		queue.forEach(function handlerIterator( handler ){
			handler()
		})
	}
	
	$jin.defer.scheduled = false
}

if( typeof addEventListener === 'function' ) addEventListener( 'message', $jin.defer.check, true )

$jin.defer.callback = function( func ){
	return function $jin_defer_callback_instance(){
		$jin.defer.scheduled = true
		try {
			return func.apply( this, arguments )
		} finally {
			$jin.defer.check()
		}
	}
}
