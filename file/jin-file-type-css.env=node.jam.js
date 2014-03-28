$jin.klass({ '$jin.file.type.css': [ '$jin.file.type.text' ] })

$jin.method({ '$jin.file.type.css.ext': function( ){
	'$jin.file.type.text.ext'
	return '.css'
}})

$jin.method({ '$jin.file.type.css.mime': function( ){
	'$jin.file.type.text.mime'
	return 'text/css'
}})

$jin.atom.prop({ '$jin.file.type.css..cssFiles': {
	resolves: [ '$jin.file.base..cssFiles' ],
	pull: function( ){
		return [ this ]
	}
}})
