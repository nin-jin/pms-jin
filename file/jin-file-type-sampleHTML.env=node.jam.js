$jin.klass({ '$jin.file.type.sampleHTML': [ '$jin.file.type.html' ] })

$jin.method({ '$jin.file.type.sampleHTML.ext': function( ){
	resolves: '$jin.file.type.html.ext'
	return '.sample.html'
}})

$jin.atom.prop({ '$jin.file.type.sampleHTML..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		var content = String( this.content() )
		
		content
		.replace
		(   /<([a-z0-9]{2,}(?:[_-][a-z0-9]{2,})+)/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		content
		.replace
		(   /[ \t\n]([a-z0-9]{2,}(?:[_-][a-z0-9]{2,})+)="/gi
		,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})

$jin.atom.prop({ '$jin.file.type.sampleHTML..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( ){
		var target = this.parent().buildFile( this.name(), {}, 'js' )
		var content = '$jin.sample.strings( ' + JSON.stringify( String( this.content() ) ) + ' )'
		target.content( content )
		return [ target ]
	}
}})
