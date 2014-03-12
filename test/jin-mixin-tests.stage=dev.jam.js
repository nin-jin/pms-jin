$jin.test( function mixin_anonymous( test ){
	var root = {
		foo: {
			bar: function(){ }
		}
	}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	$jin.mixin.object({ 'bom': [ 'foo' ] })
	
	test.equal( root.bom.bar, root.foo.bar ) 
})

