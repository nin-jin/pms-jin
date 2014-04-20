$jin.test( function getting( test ){
    var x = $jin.atom({
		pull: function(){
			return 123
		}
	})
	
    test.equal( x.get(), 123 )
} )

$jin.test( function memorizing( test ){
    var x = $jin.atom({
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
		pull: function(){
			return Math.random()
		}
	})
    
	var x1 = x.get()
    x.value( void 0 )
    var x2 = x.get()
    
	test.unique( x1, x2 )
} )

$jin.test( function pulling( test ){
    var x = $jin.atom({
		pull: function( ){
			return Math.random()
		}
	})
	
	var x1 = x.get()
	var x2 = x.pull()
	var x3 = x.get()
    
	test.unique( x1, x2 )
    test.equal( x2, x3 )
} )

$jin.test( function prev_accessing( test ){
    var x = $jin.atom({
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
		pull: function(){
			return 'foo'
		}
	})
    
	test.equal( x + 'bar', 'foobar' )
} )

$jin.test( function numberifing( test ){
    var y = $jin.atom({
		pull: function(){
			return 11
		}
	})
    
	test.equal( y + 31, 42 )
} )

$jin.test( function pushing( test ){
	var x
    var y = $jin.atom(
	{	pull: function(){
			return 12
		}
	,	push: function( next, prev ){
			x = next + '<-' + prev
		}
	} )
	y.get()
	
    test.equal( x, '12<-undefined' )
} )

$jin.test( function merging( test ){
    var x = $jin.atom(
	{	pull: function(){
			return 12
		}
	,	merge: function( next, prev ){
			return next + '<-' + prev
		}
	} )
	var x1 = x.get()
	
    test.equal( x1, '12<-undefined' )
} )

$jin.test( function tracking( test ){
    test.timeout( 100 )
    
	var x = $jin.atom({
		pull: function(){
			return 21
		}
	})
    
	var y = $jin.atom({
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

$jin.test( function mutating( test ){
    var x = $jin.atom({
		value: 12
	})
	
	x.mutate( function( prev ){
		return prev + 30
	} )
	
	test.equal( x.get(), 42 )
} )

$jin.test( function failing_while_pulling( test ){
    test.timeout( 200 )
	
	var error = $jin.log.error.ignore( new Error( 'test error' ) )
	
    var x = $jin.atom({ merge: Boolean })
    
	var y = $jin.atom({
		pull: function(){
			if( x.get() ) throw error
			else return 12
		}
	})
    
	var z = $jin.atom({
		pull: function( ){
			return y + 30
		}
	})
	
	var z1 = z.get()
	x.put( true )
	
    $jin.defer( function( ){
		try {
			var z2 = z.get()
		} catch( err ){
			test.equal( error, err ).done( true )
		}
    })
} )

$jin.test( function reaping( test ){
	test.timeout( 100 )
    var x = 1
    var y = $jin.atom({ pull: function( ){
		return x + 1
	} })
    var z = $jin.atom({ pull: function( ){
		return y + 1
	} })
    z.get()
    x = 2
    z.disobeyAll()
	$jin.schedule( 10, function(){
		test.equal( y.get(), 3 )
		test.done( true )
	} )
} )

$jin.test( function promise_instant_resolve( test ){
	test.timeout( 0 )
    
	var x = $jin.atom({ value: 1 })
	
	x.then( function( value ){
		test.equal( value, 1 ).done( true )
	} )
} )

$jin.test( function promise_instant_fail( test ){
	test.timeout( 1 )
    
	var error = new Error( 'test error' )
	var x = $jin.atom({ error: error })
	
	x['catch']( function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
} )

$jin.test( function promise_instant_then_fail( test ){
	test.timeout( 1 )
    
	var error = new Error( 'test error' )
	var x = $jin.atom({ error: error })
	
	x.then( function(){}, function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
} )

$jin.test( function promise_defer_resolve( test ){
	test.timeout( 100 )
    
	var x = $jin.atom({})
	
	x.then( function( value ){
		test.equal( value, 1 ).done( true )
	} )
	
	$jin.schedule( 0, function(){
		x.put( 1 )
	})
} )

$jin.test( function promise_defer_fail( test ){
	test.timeout( 100 )
    
	var error = new Error( 'test error' )
	var x = $jin.atom({})
	
	x['catch']( function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
	
	$jin.schedule( 0, function(){
		x.fail( error )
	})
} )
