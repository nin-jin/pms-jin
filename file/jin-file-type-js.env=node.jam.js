/**
 * @name $jin.file.type.js
 * @class $jin.file.type.js
 * @returns $jin.file.type.js
 * @mixins $jin.klass
 * @mixins $jin.file.type.text
 */
$jin.klass({ '$jin.file.type.js': [ '$jin.file.type.text' ] })

/**
 * @name $jin.file.type.js.ext
 * @method ext
 * @static
 * @member $jin.file.type.js
 */
$jin.method({ '$jin.file.type.js.ext': function( ){
	this['$jin.file.type.text.ext']
	return '.js'
}})

/**
 * @name $jin.file.type.js.mime
 * @method mime
 * @static
 * @member $jin.file.type.js
 */
$jin.method({ '$jin.file.type.js.mime': function( ){
	this['$jin.file.type.text.mime']
	return 'text/javascript'
}})

/**
 * @name $jin.file.type.js#jsFiles
 * @method jsFiles
 * @member $jin.file.type.js
 */
$jin.atom.prop({ '$jin.file.type.js..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( ){
		return [ this ]
	}
}})
