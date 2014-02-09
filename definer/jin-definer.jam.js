$jin.definer = function( path, definer ){
	
	var wrapper = function( defines ){
		if( arguments.length > 1 ){
			definer.apply( null, arguments )
		} else {
			for( var path in defines ){
				definer( path, defines[ path ] )
			}
		}
	}
	
	return $jin.glob( path, wrapper )
}

$jin.definer( '$jin.definer', $jin.definer )
