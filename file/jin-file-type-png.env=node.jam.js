$jin.klass({ '$jin.file.type.png': [ '$jin.file.base' ] })

$jin.method({ '$jin.file.type.png.ext': function( ){
	resolves: '$jin.file.base.ext'
	return '.png'
}})

$jin.method({ '$jin.file.type.png.mime': function( ){
	resolves: '$jin.file.base.mime'
	return 'image/png'
}})

$jin.atom.prop({ '$jin.file.type.png..image': {
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
		
		throw $jin.atom.wait( 'Loading image from file system...' )
	}
}})
