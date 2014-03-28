$jin.klass({ '$jin.file.type.text': [ '$jin.file.base' ] })

$jin.method({ '$jin.file.type.text.ext': function( ){
	'$jin.file.base.ext'
	return '.txt'
}})

$jin.method({ '$jin.file.type.text.mime': function( ){
	'$jin.file.base.mime'
	return 'text/plain'
}})
