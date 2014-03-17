$jin.klass({ '$jin.file.type.jamJS': [ '$jin.file.type.js' ] })

$jin.method({ '$jin.file.type.jamJS.ext': function( ){
	resolves: '$jin.file.type.js.ext'
	return '.jam.js'
}})

$jin.atom.prop({ '$jin.file.type.jamJS..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace
		(   /\$([a-z][a-z0-9]+(?:[._][a-z0-9]+)*)/ig
		,   function( str, path ){
				depends[ path.replace( /[._-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})
