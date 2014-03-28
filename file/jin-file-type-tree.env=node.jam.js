$jin.klass({ '$jin.file.type.tree': [ '$jin.file.type.text' ] })

$jin.method({ '$jin.file.type.tree.ext': function( ){
	'$jin.file.type.text.ext'
	return '.tree'
}})

$jin.method({ '$jin.file.type.tree.mime': function( ){
	'$jin.file.type.text.mime'
	return 'text/x-jin-tree'
}})
