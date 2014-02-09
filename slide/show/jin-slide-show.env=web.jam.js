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
		var size = Math.min( document.documentElement.clientWidth, document.documentElement.clientHeight )
		var next = size / 320
		return next
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNodes': {
	pull: function( ){
		var nodes = $jin.doc().cssSelect( '[' + this.id() + ']' )
		nodes.forEach( function( node ){
			node.parent( null )
		} )
		return nodes
	}
}})

$jin.atom.prop({ '$jin.slide.show..pageNumber': {
	pull: function( prev ){
		var next = Number( $jin.state.url.item( 'page' ) ) || 0
		return Math.min( next, this.pageNodes().length - 1 )
	},
	put: function( next, prev ){
		if(( next >= 0 )&&( next < this.pageNodes().length )){
			$jin.state.url.item( 'page', next )
			return next
		} else {
			return prev
		}
	}
}})

$jin.atom.prop({ '$jin.slide.show..currentPage': {
	pull: function( ){
		return this.pageNodes()[ this.pageNumber() ]
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
