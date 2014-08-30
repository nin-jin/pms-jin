/**
 * @name $jin.build
 * @class $jin.build
 * @returns $jin.build
 * @mixins $jin.klass
 * @mixins $jin.registry
 */
$jin.klass({ '$jin.build': [ '$jin.registry' ] })

$jin.module( function(){ this[ '$jin.build' ] = {
	
	'.urn': [ $jin.property, function( ){
		return $jin.uri.parse( this.id() )
	}],
	
	'.pack': [ $jin.property, function( ){
		return $jin.file( this.urn().path() )
	}],
	
	'.vary': [ $jin.property, function( ){
		return this.urn().query()
	}],
	
	'.modules': [ $jin.atom.prop.list, {
		pull: function( ){
			return this.pack().deepModuleList()
		}
	}],
	
	'.sources': [ $jin.atom.prop.list, {
		pull: function( prev ){
			var tree = this.dependTree()
			var sources = []
			
			tree.forEach( function collect( node ){
				for( var key in node ){
					if( key ) collect( node[ key ] )
					else sources = sources.concat( node[ key ] )
				}
			})
			
			return sources.map( $jin.file )
		}
	}],
	
	'.jsSources': [ $jin.atom.prop.list, {
		pull: function( prev ){
			var tsFiles = []
			
			var jsFiles = [].concat.apply( [], this.sources().map( function( src ){
				if( /\.ts$/.test( src.name() ) ){
					tsFiles.push( src )
					return [ src ]
				}
				return src.jsFiles()
			} ) )
			
			if( tsFiles.length ){
				var tsapi = $node['typescript.api']
				var create = tsapi.create
				var compile = $jin.async2sync( function( units, done ){
					tsapi.compile( units, function( result ){
						if( tsapi.check( result ) ) return done( null, result )
						var errors = result.map( function( unit ){
							return unit.diagnostics
						} )
						done( errors )
					} )
				} )
				
				tsapi.reset({ mapSourceFiles: true })
				
				var defs = { web: './node_modules/typescript.api/decl/lib.d.ts', node: './node_modules/typescript.api/decl/node.d.ts' }[ this.vary().env ]
				var sources = [ $jin.file( defs ) ].concat( tsFiles ).map( function( src ){
					return tsapi.create( src.path(), src.content().toString() )
				})
				var result = compile( sources )
				
				result.forEach( function( res ){
					var src = $jin.file( res.script.name )
					var target = src.parent().buildFile( src.name().replace( /\.ts$/, '.js' ), {}, '' )
					target.content( res.content )
					var mapping = src.parent().buildFile( src.name().replace( /\.ts$/, '.js.map' ), {}, '' )
					var map = JSON.parse( res.sourcemap )
					map.sources = map.sources.map( function( path ){ return '../' + path } )
					mapping.content( JSON.stringify( map ) )
					jsFiles[ jsFiles.indexOf( src ) ] = target
				} )
			}
			
			return jsFiles
		}
	}],
	
	'.cssSources': [ $jin.atom.prop.list, {
		pull: function( prev ){
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.cssFiles()
			} ) )
		}
	}]
	
}})



