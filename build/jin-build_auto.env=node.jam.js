$jin.module( function(){ this[ '$jin.build' ] = {
	
	'.auto': [ $jin.atom.prop, {
		pull: function( ){
			var vary = this.vary()
			
			var result = {}
			
			if( /|web/.test( vary.env ) ){
				var urn = $jin.uri( this.urn().json() ).query( 'env', 'web' ).query( 'stage', 'dev' )
				result.jsIndexWeb = $jin.build( urn + '' ).jsIndexWeb()
				result.cssIndex = $jin.build( urn ).cssIndex()
			}
			if( /|node/.test( vary.env ) ){
				var urn = $jin.uri( this.urn().json() ).query( 'env', 'node' ).query( 'stage', 'dev' )
				result.jsIndexNode = $jin.build( urn ).jsIndexNode()
			}
			if( /|release/.test( vary.env ) ){
				var urn = $jin.uri( this.urn().json() ).query( 'env', 'web' ).query( 'stage', 'release' )
				result.jsCompiled = $jin.build( urn ).jsCompiled()
				
				var urn = $jin.uri( this.urn().json() ).query( 'env', 'node' ).query( 'stage', 'release' )
				result.jsCompiled = $jin.build( urn ).jsCompiled()
			}
			
			return result
		},
		merge: function( next, prev ){
			return ( String( next ) == String( prev ) ) ? prev : next
		}
	}]
	
}})
