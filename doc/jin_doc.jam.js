/**
 * @name $jin.doc
 * @class $jin.doc
 * @returns $jin.doc
 * @mixins $jin.klass
 * @mixins $jin.dom
 */
$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

/**
 * @name $jin.doc.exec
 * @method exec
 * @static
 * @member $jin.doc
 */
$jin.method({ '$jin.doc.exec': function( node ){
	if( !arguments.length ) node = window.document
	
	var doc = node[ '$jin.doc' ]
	if( doc ) return doc
	
	return node[ '$jin.doc' ] = this['$jin.wrapper.exec']( node )
}})

/**
 * @name $jin.doc#findById
 * @method findById
 * @member $jin.doc
 */
$jin.method({ '$jin.doc..findById': function( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
}})

/**
 * @name $jin.doc#selection
 * @method selection
 * @member $jin.doc
 */
$jin.method({ '$jin.doc..selection': function( ){
	var doc = this.nativeNode()
	return $jin.dom.selection( doc.defaultView ? doc.defaultView.getSelection() : doc.selection )
}})

/**
 * @name $jin.doc#sizeListener
 * @method sizeListener
 * @member $jin.doc
 */
$jin.property({ '$jin.doc..sizeListener': function( ){
	return this.entangle( $jin.dom.event.onResize.listen( window, function( ){
		this.size( void 0 )
	}.bind( this ) ) )
} } )

/**
 * @name $jin.doc#size
 * @method size
 * @member $jin.doc
 */
$jin.atom1.prop({ '$jin.doc..size': {
	resolves: [ '$jin.dom..size' ],
	pull: function( ){
		this.sizeListener()
		var root = document.documentElement
		return $jin.vector([ root.clientWidth, root.clientHeight ])
	}
} } )
