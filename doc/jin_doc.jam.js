$jin.klass({ '$jin.doc': [ '$jin.dom' ] })

$jin.method( '$jin.dom.exec', '$jin.doc.exec', function( node ){
	return this['$jin.dom.exec']( arguments.length ? node : window.document )
} )

$jin.method( '$jin.doc..findById', function( id ){
	return $jin.dom( this.nativeNode().getElementById( id ) )
} )

$jin.method( '$jin.doc..selection', function( ){
	var doc = this.nativeNode()
	return $jin.dom.selection( doc.selection || doc.defaultView.getSelection() )
} )
