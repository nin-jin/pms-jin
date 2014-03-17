$jin.klass({ '$jin.file.type.html': [ '$jin.file.type.text' ] })

$jin.method({ '$jin.file.type.html.ext': function( ){
	resolves: '$jin.file.type.text.ext'
	return '.html'
}})

$jin.method({ '$jin.file.type.html.mime': function( ){
	resolves: '$jin.file.type.text.mime'
	return 'text/html'
}})
