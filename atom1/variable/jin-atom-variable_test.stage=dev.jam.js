$jin.test( function mutating( test ){
    var x = $jin.atom1({
		name: 'test',
		value: 12
	})
	
	x.mutate( function( prev ){
		return prev + 30
	} )
	
	test.equal( x.get(), 42 )
} )

$jin.test( function instant_resolve( test ){
	test.timeout( 0 )
    
	var x = $jin.atom1({
		name: 'test',
		value: 1
	})
	
	x.then( function( value ){
		test.equal( value, 1 ).done( true )
	} )
} )

$jin.test( function instant_fail( test ){
	test.timeout( 1 )
    
	var error = new Error( 'test error' )
	var x = $jin.atom1({
		name: 'test',
		error: error
	})
	
	x['catch']( function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
} )

$jin.test( function instant_then_fail( test ){
	test.timeout( 1 )
    
	var error = new Error( 'test error' )
	var x = $jin.atom1({
		name: 'test',
		error: error
	})
	
	x.then( function(){}, function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
} )

$jin.test( function defer_resolve( test ){
	test.timeout( 100 )
    
	var x = $jin.atom1({
		name: 'test'
	})
	
	x.then( function( value ){
		test.equal( value, 1 ).done( true )
	} )
	
	new $jin.schedule( 0, function(){
		x.put( 1 )
	})
} )

$jin.test( function double_change( test ){
	test.timeout( 100 )
    
	var x = $jin.atom1({
		name: 'test'
	})
	var done = false
	
	x.then( function( value ){
		if( done ) test.fail()
		done = true
		x.put( 2 )
		new $jin.defer( function(){
			test.done( true )
		} )
	} )
	
	x.put( 1 )
} )

$jin.test( function pipeline( test ){
	test.timeout( 100 )
    
	var x = $jin.atom1({
		name: 'test'
	})
	
	x
	.then( function( value ){
		return value + 1
	} )
	.then( function( value ){
		test.equal( value, 2 ).done( true )
	} )
	
	x.put( 1 )
} )

$jin.test( function defer_fail( test ){
	test.timeout( 100 )
    
	var error = new Error( 'test error' )
	$jin.log.error.ignore( error )
	
	var x = $jin.atom1({
		name: 'test'
	})
	
	x['catch']( function( error2 ){
		test.equal( error, error2 ).done( true )
	} )
	
	new $jin.schedule( 0, function(){
		x.fail( error )
	})
} )
