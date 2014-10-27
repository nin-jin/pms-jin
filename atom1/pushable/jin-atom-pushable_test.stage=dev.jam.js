$jin.test( function pushing( test ){
	var x
    var y = $jin.atom1({
		name: 'test',
		pull: function(){
			return 12
		},
		push: function( next, prev ){
			x = next + '<-' + prev
		}
	})
	y.get()
	
	new $jin.defer( function( ){
	    test.equal( x, '12<-undefined' )
	} )
} )
