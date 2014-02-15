$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

$jin.method( '$jin.dom.exec', '$jin.doc.exec', function( node ){
	if( !arguments.length ) node = window.document
	
	var doc = node[ '$jin.doc' ]
	if( doc ) return doc
	
	return node[ '$jin.doc' ] = this['$jin.dom.exec']( node )
} )

$jin.method( '$jin.doc..findById', function( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
} )

$jin.method( '$jin.doc..selection', function( ){
	var doc = this.nativeNode()
	return $jin.dom.selection( doc.selection || doc.defaultView.getSelection() )
} )

$jin.property({ '$jin.doc..sizeListener': function( ){
	return this.entangle( $jin.dom.event.onResize.listen( window, function( ){
		this.size( void 0 )
	}.bind( this ) ) )
} } )

$jin.atom.prop({ '$jin.doc..size': {
	pull: function( ){
		this.sizeListener()
		var root = document.documentElement
		return $jin.vector([ root.clientWidth, root.clientHeight ])
	}
} } )
