$jin.klass({ '$jin.file.type.js': [ '$jin.file.type.text' ] })

$jin.method({ '$jin.file.type.js.ext': function( ){
	resolves: '$jin.file.type.text.ext'
	return '.js'
}})

$jin.method({ '$jin.file.type.js.mime': function( ){
	resolves: '$jin.file.type.text.mime'
	return 'text/javascript'
}})

$jin.atom.prop({ '$jin.file.type.js..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( ){
		return [ this ]
	}
}})
