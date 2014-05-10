/**
 * @name $jin.file.type.html
 * @class $jin.file.type.html
 * @returns $jin.file.type.html
 * @mixins $jin.klass
 * @mixins $jin.file.type.text
 */
$jin.klass({ '$jin.file.type.html': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.html.ext
 * @method ext
 * @static
 * @member $jin.file.type.html
 */
$jin.method({ '$jin.file.type.html.ext': function( ){
	'$jin.file.type.text.ext'
	return '.html'
}})

/**
 * @name $jin.file.type.html.mime
 * @method mime
 * @static
 * @member $jin.file.type.html
 */
$jin.method({ '$jin.file.type.html.mime': function( ){
	'$jin.file.type.text.mime'
	return 'text/html'
}})
