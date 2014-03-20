$jin.klass({ '$jin.docs.view.node': [ '$jin.view' ] })

$jin.atom.prop({ '$jin.docs.view.node..isExpanded': {
	pull: function(){
		return this.state( this.id() + ';isExpanded' ) == 'true'
	},
	put: function( state ){
		this.state( this.id() + ';isExpanded', state )
	}
}})

$jin.atom.prop({ '$jin.docs.view.node..name': {
	pull: function( ){
		return this.id() //.replace( /^.*\./, '' ) || 'prototype'
	}
}})

$jin.atom.prop({ '$jin.docs.view.node..childs': {
	pull: function( ){
		if( !this.isExpanded() ) return null
		
		var id = this.id()
		
		var reg = $jin.docs.registry()
		var paths = Object.keys( reg ).filter( function( path ){
			if( path.substring( 0, id.length ) !== id ) return false
			if( path.length <= id ) return false
			if( path.split( /\./ ).length - id.split( /\./ ).length !== 1 ) return false
			return true
		} )
		
		var childs = paths.map( function( path ){
			return $jin.docs.view.node( path )
		} )
		
		return childs
	}
}})

$jin.atom.prop({ '$jin.docs.view.node..info': {
	pull: function( ){
		return $jin.docs.registry( this.id() )
	}
}})

$jin.atom.prop({ '$jin.docs.view.node..descr': {
	pull: function( ){
		return this.info().map( function( info ){
			return info.descr || null
		} )
	}
}})

$jin.atom.prop({ '$jin.docs.view.node..signatures': {
	pull: function( ){
		var name = this.name()
		var signatures = []
		
		this.info().forEach( function( info ){
			if( !info.params ) return
			
			var params = info.params.map( function( param ){
				return param.name + ' : ' + param.types.join( '|' ) + ( param.isOptional ? '?' : '' )
			} )
			
			signatures.push( name + '( ' + params.join( ', ' ) + ' ) : ' + info.returns )
		} )
		
		return signatures.join( '\n' )
	}
}})
