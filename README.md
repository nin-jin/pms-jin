Stable modules
========

[$jin.time](time/readme.md) - proper date/time/duration/range arithmetic

[$jin.method](method/jin-method.doc.md) - method definer (obsolete, use TS instead)

Building your package
=======

Instal builder

	npm install pms

Create build-script "build.js" and put into:

```js
with( require( 'pms' ) ) // loads prebuilded builder (may be old version)
$pms.application( function( ){
    with( $jin.build( 'jin/build?env=node' ).jsIndexNode()[0].load() ){ // build and load $jin.build package
    	$jin.build( 'jin/atom?env=web' ).jsCompiled() // builds $jin.atom standalone js-library
	
	// builds js for $foo.bar
    	$jin.build( 'jin/slide?env=web' ).jsIndexWeb() // use jsCompiled instead
    	$jin.build( 'jin/slide?env=web' ).jsCompiled() // supports TS and source maps

	// builds css for $foo.bar
    	$jin.build( 'jin/slide?env=web' ).cssIndex() // use cssCompiled instaed 
    	$jin.build( 'jin/slide?env=web' ).cssCompiled() // supports Stylus and source maps
    	
    	//wait for file changes
    	$jin.alert( 'Press any key to stop automatic rebuild' )
    }
})
```

Create your namespace(foo) and application(bar) directories:

	/
		build.js
		jin/
			...
		foo/
			bar/

Put into foo/bar file "foo-bar.meta.tree":

	include =jin/atom
	include =jin/view

Or(!) simple use its in JAM-file "foo-bar.jam.js":

```js
$jin.alert( 'Hello world' ) // Isomorphic alert
```

Then run building:

	node --harmony build.js

That builds all needed js and css files. You can find them in "-mix" subdirectories.
