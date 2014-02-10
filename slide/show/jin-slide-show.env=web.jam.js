$jin.klass({ '$jin.slide.show': [ '$jin.view' ] })

$jin.property({ '$jin.slide.show..stack': null })

$jin.atom.prop({ '$jin.slide.show..resizeCount': {
	pull: function( ){
		$jin.dom.event.onResize.listen( window, function(){
			this.resizeCount( this.resizeCount() + 1 )
		}.bind( this ) )
		return 0
	}
}})

$jin.atom.prop({ '$jin.slide.show..zoom': {
	pull: function( ){
		this.resizeCount()
		var size = document.documentElement.clientWidth + document.documentElement.clientHeight
		var next = size / 1024
		return next
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNodeList': {
	pull: function( ){
		var nodes = $jin.doc().cssSelect( '[' + this.id() + ']' )
		nodes.forEach( function( node ){
			node.parent( null )
		} )
		return nodes
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNodeMap': {
	pull: function( ){
		var map = {}
		this.pageNodeList().forEach( function( node ){
			map[ node.attr( 'jin-slide-show-page' ) ] = node
		} )
		return map
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNodeCurrent': {
	pull: function( prev ){
		var id = $jin.state.url.item( 'slide' )
		return this.pageNodeMap()[ id ] || this.pageNodeList()[ 0 ]
	},
	put: function( next, prev ){
		if( !next ) return prev
		
		$jin.state.url.item( 'slide', next.attr( 'jin-slide-show-page' ) )
		return next
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNumber': {
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

$jin.method({ '$jin.slide.show..goPrev': function( ){
	this.pageNumber( this.pageNumber() - 1 )
	return this
}})

$jin.method({ '$jin.slide.show..goNext': function( ){
	this.pageNumber( this.pageNumber() + 1 )
	return this
}})

$jin.method({ '$jin.slide.show..onWheel': function( event ){
	if( event.nativeEvent().wheelDelta < 0 ) this.goNext()
	else this.goPrev()
	event.catched( true )
}})

$jin.method({ '$jin.slide.show..onPress': function( event ){
	var code = event.keyCode()
	
	if( [ 34, 39, 40 ].indexOf( code ) >= 0 ) this.goNext()
	else if( [ 33, 37, 38 ].indexOf( code ) >= 0 ) this.goPrev()
	else return
	
	event.catched( true )
}})
