$jin.test( function getting( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function(){
			return 123
		}
	})
	
    test.equal( x.get(), 123 )
} )

$jin.test( function memorizing( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function(){
			return Math.random()
		}
	})
    
	var x1 = x.get()
	var x2 = x.get()
	
	test.equal( x1, x2 )
} )

$jin.test( function resetting( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function(){
			return Math.random()
		}
	})
    
	var x1 = x.get()
    x.clear()
    var x2 = x.get()
    
	test.unique( x1, x2 )
} )

$jin.test( function pulling( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function( ){
			return Math.random()
		}
	})
	
	var x1 = x.get()
	var x2 = x.pull().get()
    
	test.unique( x1, x2 )
} )

$jin.test( function prev_accessing( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function( old ){
			return old || Math.random()
		}
	})
	
	var x1 = x.pull()
	var x2 = x.pull()
    
	test.equal( x1, x2 )
} )

$jin.test( function stringifing( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function(){
			return 'foo'
		}
	})
    
	test.equal( x + 'bar', 'foobar' )
} )

$jin.test( function numberifing( test ){
    var y = $jin.atom({
		name: 'test',
		pull: function(){
			return 11
		}
	})
    
	test.equal( y + 31, 42 )
} )

$jin.test( function merging( test ){
    var x = $jin.atom({
		name: 'test',
		pull: function(){
			return 12
		},
		merge: function( next, prev ){
			return next + '<-' + prev
		}
	})
	var x1 = x.get()
	
    test.equal( x1, '12<-undefined' )
} )

$jin.test( function tracking( test ){
    test.timeout( 100 )
    
	var x = $jin.atom({
		name: 'test',
		pull: function(){
			return 21
		}
	})
    
	var y = $jin.atom({
		name: 'test',
		pull: function(){
			return x + 30
		}
	})
    
	var y1 = y.get()
    x.put( 12 )
	
    $jin.defer( function(){
        var y2 = y.get()
		
        test.equal( y2, 42 ).done( true )
    } )
} )

$jin.test( function failing_while_pulling( test ){
    test.timeout( 200 )
	
	var error = $jin.log.error.ignore( new Error( 'test error' ) )
	
    var x = $jin.atom({
		name: 'test',
		merge: Boolean
	})
    
	var y = $jin.atom({
		name: 'test',
		pull: function(){
			if( x.get() ) throw error
			else return 12
		}
	})
    
	var z = $jin.atom({
		name: 'test',
		pull: function( ){
			return y + 30
		}
	})
	
	var z1 = z.get()
	x.put( true )
	
    $jin.defer( function( ){
		try {
			throw z.get()
		} catch( err ){
			test.equal( error, err ).done( true )
		}
    })
} )

//$jin.test( function reaping( test ){
//	test.timeout( 100 )
//    var x = 1
//    var y = $jin.atom({ pull: function( ){
//		return x + 1
//	} })
//    var z = $jin.atom({ pull: function( ){
//		return y + 1
//	} })
//    z.get()
//    z.disobeyAll()
//    x = 2
//	$jin.schedule( 10, function(){
//		test.equal( y.get(), 3 )
//		test.done( true )
//	} )
//} )
