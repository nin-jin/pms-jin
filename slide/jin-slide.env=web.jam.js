/**
 * @name $jin.slide
 * @class $jin.slide
 * @returns $jin.slide
 * @mixins $jin.klass
 * @mixins $jin.view
 */
$jin.klass({ '$jin.slide': [ '$jin.view' ] })

/**
 * @name $jin.slide#stack
 * @method stack
 * @member $jin.slide
 */
$jin.property({ '$jin.slide..stack': null })

/**
 * @name $jin.slide#resizeCount
 * @method resizeCount
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..resizeCount': {
	pull: function( ){
		$jin.dom.event.onResize.listen( window, function(){
			this.resizeCount( this.resizeCount() + 1 )
		}.bind( this ) )
		return 0
	}
}})

/**
 * @name $jin.slide#zoom
 * @method zoom
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..zoom': {
	pull: function( ){
		this.resizeCount()
		var size = Math.min( document.documentElement.clientWidth, document.documentElement.clientHeight )
		var next = size / 360
		return next
	}
}})

/**
 * @name $jin.slide#pageNodeList
 * @method pageNodeList
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..pageNodeList': {
	pull: function( ){
		var nodes = $jin.doc().cssSelect( '#' + this.id() + ' > section' )
		nodes.forEach( function( node ){
			node.parent( null )
		} )
		return nodes
	}
}})

/**
 * @name $jin.slide#pageNodeMap
 * @method pageNodeMap
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..pageNodeMap': {
	pull: function( ){
		var map = {}
		this.pageNodeList().forEach( function( node ){
			map[ node.attr( 'jin-slide-page' ) ] = node
		} )
		return map
	}
}})

/**
 * @name $jin.slide#pageNodeCurrent
 * @method pageNodeCurrent
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..pageNodeCurrent': {
	pull: function( prev ){
		var id = $jin.state.url.item( 'slide' )
		return this.pageNodeMap()[ id ] || this.pageNodeList()[ 0 ]
	},
	put: function( next, prev ){
		if( !next ) return prev
		
		$jin.state.url.item( 'slide', next.attr( 'jin-slide-page' ) )
		return next
	}
}})

/**
 * @name $jin.slide#pageNumber
 * @method pageNumber
 * @member $jin.slide
 */
$jin.atom.prop({ '$jin.slide..pageNumber': {
	pull: function( prev ){
		return this.pageNodeList().indexOf( this.pageNodeCurrent() )
	},
	put: function( next, prev ){
		var nodes = this.pageNodeList()
		if(( next >= 0 )&&( next < nodes.length )){
			this.pageNodeCurrent( nodes[ next ] )
			return next
		} else {
			return prev
		}
	}
}})

/**
 * @name $jin.slide#goPrev
 * @method goPrev
 * @member $jin.slide
 */
$jin.method({ '$jin.slide..goPrev': function( ){
	this.pageNumber( this.pageNumber() - 1 )
	return this
}})

/**
 * @name $jin.slide#goNext
 * @method goNext
 * @member $jin.slide
 */
$jin.method({ '$jin.slide..goNext': function( ){
	this.pageNumber( this.pageNumber() + 1 )
	return this
}})

/**
 * @name $jin.slide#onWheel
 * @method onWheel
 * @member $jin.slide
 */
$jin.method({ '$jin.slide..onWheel': function( event ){
	if( event.nativeEvent().wheelDelta < 0 ) this.goNext()
	else this.goPrev()
	event.catched( true )
}})

/**
 * @name $jin.slide#onPress
 * @method onPress
 * @member $jin.slide
 */
$jin.method({ '$jin.slide..onPress': function( event ){
	var code = event.keyCode()
	
	if( [ 34, 39, 40 ].indexOf( code ) >= 0 ) this.goNext()
	else if( [ 33, 37, 38 ].indexOf( code ) >= 0 ) this.goPrev()
	else return
	
	event.catched( true )
}})
