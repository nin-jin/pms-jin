$jin.definer({ '$jin.konst': function( path, gen ){
	$jin.method( path, function jin_konst_wrapper(){
		var key = '_' + path
		return this[ key ] || ( this[ key ] = gen.call( this ) )
	})
}})
