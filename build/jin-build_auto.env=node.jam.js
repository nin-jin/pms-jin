$jin.atom.prop({ '$jin.build..auto': {
	pull: function( ){
		
		var vary = this.vary()
		
		if( vary.stage === 'release' ) this.jsCompiled()
		else if( vary.env === 'web' ) this.jsIndexWeb()
		else if( vary.env === 'node' ) this.jsIndexNode()
		
	},
	merge: function( next, prev ){
		return ( String( next ) == String( prev ) ) ? prev : next
	}
}})
