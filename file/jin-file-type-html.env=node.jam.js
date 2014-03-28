$jin.klass({ '$jin.file.type.html': [ '$jin.file.type.text' ] })

$jin.method({ '$jin.file.type.html.ext': function( ){
	'$jin.file.type.text.ext'
	return '.html'
}})

$jin.method({ '$jin.file.type.html.mime': function( ){
	'$jin.file.type.text.mime'
	return 'text/html'
}})
