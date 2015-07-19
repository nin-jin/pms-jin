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
	
	'.modules': [ $jin.atom1.prop.list, {
		pull: function( ){
			return this.pack().deepModuleList()
		}
	}],
	
	'.sources': [ $jin.atom1.prop.list, {
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
	
	'.jsSources': [ $jin.atom1.prop.list, {
		pull: function( prev ){
			var tsFiles = []

			var jsFiles = [].concat.apply( [], this.sources().map( function( src ){
				var files = src.jsFiles()
				files.forEach( function( file ) {
					if (!/\.ts$/.test(file.name())) return
					tsFiles.push(file)
				} )
				return files
			} ) )
			
			if( tsFiles.length ){
				var program = $node.typescript.createProgram( tsFiles.map( String ), {
					noEmitOnError: false,
					noImplicitAny: false,
					target: $node.typescript.ScriptTarget.ES5,
					outDir: this.pack().resolve( '-mix' ).toString(),
					removeComments: true,
					sourceMap: true
				})
				var result = program.emit()

				var errors = $node.typescript.getPreEmitDiagnostics(program).concat(result.diagnostics)
				var logs = []

				errors.forEach( function( error ) {
					var pos = error.file.getLineAndCharacterOfPosition(error.start)
					var message = $node.typescript.flattenDiagnosticMessageText(error.messageText, '\n')
					logs.push( error.file.fileName + ':' + pos.line + ':' + pos.character + '\n ' + message )
				});

				if( logs.length ) throw new Error( logs.join( '\n' ) )

				tsFiles.forEach( function( src ){
					var target = this.pack().buildFile( src.relate().replace( /\.ts$/, '.js' ), {}, '' )
					jsFiles[ jsFiles.indexOf( src ) ] = target
				}.bind(this) )
			}
			
			return jsFiles
		}
	}],
	
	'.cssSources': [ $jin.atom1.prop.list, {
		pull: function( prev ){
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.cssFiles()
			} ) )
		}
	}]
	
}})
