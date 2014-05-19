/**
 * @name $jin.build#cssIndex
 * @method cssIndex
 * @member $jin.build
 */
$jin.atom.prop.list({ '$jin.build..cssIndex': {
	pull: function( prev ){
		var pack = this.pack()
		var vary = this.vary()
		
		var target = pack.buildFile( 'index', vary, 'css' )
		var targets = [ target ]
		
		var sources = this.cssSources()
		
		if( sources.length > 30  ){
			var lines = []
			
			var page = 0
			var pageLines = []
			
			function makePage( ){
				var pageFile= pack.buildFile( 'index.page=' + page, vary, 'css' )
				pageFile.content( pageLines.join( '\n' ) )
				targets.push( pageFile )
				lines.push( '@import url( "' + pageFile.uri( target.parent() ) + '" );' )
				++page
				pageLines = []
			}
			
			sources.forEach( function( src ){
				pageLines.push( '@import url( "' + src.uri( target.parent() ) + '" );' )
				if( pageLines.length > 30 ) makePage()
			})
			
			if( pageLines.length ) makePage()
			
		} else {
			var lines = sources.map( function( src ){
				return '@import url("' + src.uri( target.parent() ) + '");'
			} )
		}
		
		target.content( lines.join( '\n' ) )
		
		$jin.log( target.relate() )
		
		return targets
	}
}})
