$jin.klass({ '$jin.file.type.ngHtml': [ '$jin.file.type.html' ] })

$jin.method({ '$jin.file.type.ngHtml.ext': function( ){
	this['$jin.file.type.html.ext']
	return '.ng.html'
}})

$jin.atom1.prop({ '$jin.file.type.ngHtml..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {
			'ng' : true
		}

		var content = String( this.content() )

		content
		.replace
		(   /<([a-z][a-z0-9]+(?:[-_][a-z0-9]+)+)/ig
			,   function( str, path ){
				depends[ path.replace( /[._-]/g, '/' ) ] = 1
			}
		)

		content
		.replace
		(   /[ \t\n]([a-z0-9]{2,}(?:[_-][a-z0-9]{2,})+)="/gi
			,   function( str, path ){
				depends[ path.replace( /[_-]/g, '/' ) ] = 1
			}
		)

		return depends
	}
}})

$jin.atom1.prop.list({ '$jin.file.type.ngHtml..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'js' )
		var template = String( this.content() )
		var id = this.parent().relate().replace( /\//g , '_' )
		var mod = id.split( '_' )[0]

		var content =
			'angular.module("' + mod + '").run( function( $'+'templateCache ) {' +
				'$'+'templateCache.put("' + id + '", ' + JSON.stringify( template ) + ')' +
			'} )'

		target.content( content )
		
		if( prev ) $jin.log( target.relate() )
		
		return [ target ]
	}
}})
