/**
 * @name $jin.file.type.png
 * @class $jin.file.type.png
 * @returns $jin.file.type.png
 * @mixins $jin.klass
 * @mixins $jin.file.base
 */
$jin.klass({ '$jin.file.type.png': [ '$jin.file.base' ] })

/**
 * @name $jin.file.type.png.ext
 * @method ext
 * @static
 * @member $jin.file.type.png
 */
$jin.method({ '$jin.file.type.png.ext': function( ){
	this['$jin.file.base.ext']
	return '.png'
}})

/**
 * @name $jin.file.type.png.mime
 * @method mime
 * @static
 * @member $jin.file.type.png
 */
$jin.method({ '$jin.file.type.png.mime': function( ){
	this['$jin.file.base.mime']
	return 'image/png'
}})

/**
 * @name $jin.file.type.png#image
 * @method image
 * @member $jin.file.type.png
 */
$jin.atom1.prop({ '$jin.file.type.png..image': {
	pull: function( ){
		var png = new $node.pngjs.PNG
		var atom = this.image_atom()
		
		$node.fs.createReadStream( this.path() )
		.pipe( png )
		.on( 'parsed', function( ){
			atom.put( png )
		} )
		.on( 'error', function( error ){
			atom.fail( error )
		} )
		
		//throw $jin.atom1.wait( 'Loading image from file system...' )
	}
}})
