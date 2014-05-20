/**
 * @name $jin.file.type.tree
 * @class $jin.file.type.tree
 * @returns $jin.file.type.tree
 * @mixins $jin.klass
 * @mixins $jin.file.type.text
 */
$jin.klass({ '$jin.file.type.tree': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.tree.ext
 * @method ext
 * @static
 * @member $jin.file.type.tree
 */
$jin.method({ '$jin.file.type.tree.ext': function( ){
	this['$jin.file.type.text.ext']
	return '.tree'
}})

/**
 * @name $jin.file.type.tree.mime
 * @method mime
 * @static
 * @member $jin.file.type.tree
 */
$jin.method({ '$jin.file.type.tree.mime': function( ){
	this['$jin.file.type.text.mime']
	return 'text/x-jin-tree'
}})
