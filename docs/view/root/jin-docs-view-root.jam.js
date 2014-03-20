$jin.klass({ '$jin.docs.view.root': [ '$jin.view' ] })

$jin.method({ '$jin.docs.view.root..content': function( ){
	var reg = $jin.docs.registry()
	
	var items = Object.keys( reg )
	.filter( function( path ){
		return !/\./.test( path )
	})
	.map( $jin.docs.view.node )
	
	return items
} })
