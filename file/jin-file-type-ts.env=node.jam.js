/**
 * @name $jin.file.type.ts
 * @class $jin.file.type.ts
 * @returns $jin.file.type.ts
 * @mixins $jin.klass
 * @mixins $jin.file.type.text
 */
$jin.klass({ '$jin.file.type.ts': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.ts.ext
 * @method ext
 * @static
 * @member $jin.file.type.ts
 */
$jin.method({ '$jin.file.type.ts.ext': function( ){
	this['$jin.file.type.text.ext']
	return '.ts'
}})

/**
 * @name $jin.file.type.ts#dependList
 * @method dependList
 * @member $jin.file.type.ts
 */
$jin.atom1.prop.list({ '$jin.file.type.ts..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		var lines = String( this.content()).replace( /\/\*[\s\S]*?\*\//g, '' ).split( '\n' )

		lines.forEach( function( line ){
			line = line.replace( /\/\/.*/ , '' )
			var indent = /^((?:    )+|\t+)*/.exec( line )
			var priority = indent[0].length
			if( indent[0][0] === ' ' ) priority /= 4
			line.replace
			(   /\$([a-z][a-z0-9]+(?:[._][a-z0-9]+)*)/ig
				,   function( str, path ){
					var name = path.replace( /[._-]/g, '/' )
					if( typeof depends[ name ] === 'number' ) {
						depends[ name ] = Math.min( depends[ name ] , priority )
					} else {
						depends[ name ] = priority
					}
				}
			)
		})

		return depends
	}
}})

$jin.atom1.prop({ '$jin.file.type.ts..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( ){
		return [ this ]
	}
}})
