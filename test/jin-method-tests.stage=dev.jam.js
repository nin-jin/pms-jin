$jin.test( function defining( test ){
	var root = {}
	var func = function(){}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func })
	
	test.equal( root.foo.bar, func )
})

$jin.test( function conflicting( test ){
	var root = {}
	var func1 = function(){}
	var func2 = function(){}
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func1 })
	/**
 * @name foo.bar
 * @method bar
 * @static
 * @member foo
 */
$jin.method({ 'foo.bar': func2 })
	
	try {
		root.foo.bar()
	} catch( e ){
		var error = e
	}
	
	test.ok( error )
})

$jin.test( function manual_resolving( test ){
	var root = {}
	var func1 = function(){ return 123 }
	var func2 = function(){ return 321 }
	func2.jin_method_resolves = [ '$f.bar1' ]
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name $f.bar1
 * @method bar1
 * @static
 * @member $f
 */
$jin.method({ '$f.bar1': func1 })
	/**
 * @name $f.bar2
 * @method bar2
 * @static
 * @member $f
 */
$jin.method({ '$f.bar2': func2 })
	
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func1 })
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func2 })
	
	root.$f.bar()
})

$jin.test( function auto_resolving( test ){
	var root = {}
	var func1 = function(){ return 123 }
	var func2 = function(){ '$f.bar1'; return 321 }
	
	var mock = test.mock( '$jin.root', $jin.value( root ) )
	
	/**
 * @name $f.bar1
 * @method bar1
 * @static
 * @member $f
 */
$jin.method({ '$f.bar1': func1 })
	/**
 * @name $f.bar2
 * @method bar2
 * @static
 * @member $f
 */
$jin.method({ '$f.bar2': func2 })
	
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func1 })
	/**
 * @name $f.bar
 * @method bar
 * @static
 * @member $f
 */
$jin.method({ '$f.bar': func2 })
	
	root.$f.bar()
})


