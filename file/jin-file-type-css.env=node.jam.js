/**
 * @name $jin.file.type.css
 * @class $jin.file.type.css
 * @returns $jin.file.type.css
 * @mixins $jin.klass
 * @mixins $jin.file.type.text
 */
$jin.klass({ '$jin.file.type.css': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.css.ext
 * @method ext
 * @static
 * @member $jin.file.type.css
 */
$jin.method({ '$jin.file.type.css.ext': function( ){
	this['$jin.file.type.text.ext']
	return '.css'
}})

/**
 * @name $jin.file.type.css.mime
 * @method mime
 * @static
 * @member $jin.file.type.css
 */
$jin.method({ '$jin.file.type.css.mime': function( ){
	this['$jin.file.type.text.mime']
	return 'text/css'
}})

/**
 * @name $jin.file.type.css#cssFiles
 * @method cssFiles
 * @member $jin.file.type.css
 */
$jin.atom.prop({ '$jin.file.type.css..cssFiles': {
	resolves: [ '$jin.file.base..cssFiles' ],
	pull: function( ){
		return [ this ]
	}
}})
