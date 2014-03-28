$jin.klass({ '$jin.file.type.jamCSS': [ '$jin.file.type.css' ] })

$jin.method({ '$jin.file.type.jamCSS.ext': function( ){
	'$jin.file.type.css.ext'
	return '.jam.css'
}})

$jin.atom.prop({ '$jin.file.type.jamCSS..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace
		(   /[.]([a-z0-9]{2,}(?:[-_][a-z0-9]{2,})+)\b/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})
