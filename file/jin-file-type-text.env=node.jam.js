/**
 * @name $jin.file.type.text
 * @class $jin.file.type.text
 * @returns $jin.file.type.text
 * @mixins $jin.klass
 * @mixins $jin.file.base
 */
$jin.klass({ '$jin.file.type.text': [ '$jin.file.base' ] })

/**
 * @name $jin.file.type.text.ext
 * @method ext
 * @static
 * @member $jin.file.type.text
 */
$jin.method({ '$jin.file.type.text.ext': function( ){
	this['$jin.file.base.ext']
	return '.txt'
}})

/**
 * @name $jin.file.type.text.mime
 * @method mime
 * @static
 * @member $jin.file.type.text
 */
$jin.method({ '$jin.file.type.text.mime': function( ){
	this['$jin.file.base.mime']
	return 'text/plain'
}})
