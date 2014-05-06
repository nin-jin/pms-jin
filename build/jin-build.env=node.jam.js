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
			return [].concat.apply( [], this.sources().map( function( src ){
				return src.jsFiles()
			} ) )
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



