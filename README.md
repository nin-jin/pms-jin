Building
=======

Instal builder

	npm install pms

Create build-script "build.js" and put into:

    with( require( 'pms' ) ) // loads prebuilded builder (may be old version)
    $pms.application( function( ){ // use $jin.persistent for rebuilding on file changes
    	with( $jin.build4node.dev( 'jin' ).load() ){ // install, build and load $jin package
    		$jin.build4web.js.release( 'jin/atom' ) // builds $jin.atom js-library
			
    		$jin.build4web.sample.release( 'jin/slide' ) // builds samples for $jin.slide
			
    		$jin.build4web.js.dev( 'jin/slide' )
    		$jin.build4web.js.release( 'jin/slide' )
			
    		$jin.build4web.css.dev( 'jin/slide' )
    		$jin.build4web.css.release( 'jin/slide' )
    	}
    })

Create your namespace(foo) and application(bar) directories:

	/
		build.js
		jin/
			...
		foo/
			bar/

Put into foo/bar file "foo-bar.meta.tree":

	include =jin/atom
	include = jin/view

Or(!) simple use its in JAM-file "foo-bar.jam.js":

	$jin.klass({ '$foo.bar': [ '$jin.view' ] })
	$jin.atom.prop({ '$foo.bar.title': {
		pull: function( ){
			return Math.random()
		},
		push: function( next ){
			window.name = next
		}
	} })

Then run building:

	node --harmony build.js

That builds all needed js and css files. You can find tem in "-mix" subdirectories.s
