$jin.definer({ '$jin.module': function( prefix, map ){
	if( typeof map === 'function' ) map = new map
	
	for( var suffix in map ){
		var arg = map[ suffix ]
		if( arg[0] ){
			var definer = arg[0]
			definer.apply( null, [ prefix + '.' + suffix ].concat( arg.slice( 1 ) ) )
		} else {
			map[ suffix ]( prefix + '.' + suffix  )
		}
	}
	
}})
