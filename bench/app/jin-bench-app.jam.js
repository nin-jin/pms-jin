/**
 * @name $jin.bench.app
 * @class $jin.bench.app
 * @mixins $jin.klass
 * @mixins $jin.view2
 * @returns $jin.bench.app
 */
$jin.klass({ '$jin.bench.app': [ '$jin.view2' ] })

/**
 * @name $jin.bench.app#setupCode
 * @method setupCode
 * @member $jin.bench.app
 */
$jin.atom.prop({ '$jin.bench.app..setupCode': {
	pull: function( ){
		return ''
	}
}})

/**
 * @name $jin.bench.app#setup
 * @method setup
 * @member $jin.bench.app
 */
$jin.atom.prop({ '$jin.bench.app..setup': {
	pull: function( ){
		return this.child( 'setup', $jin.editor ).valueProp( this.setupCode.bind( this ) )
	}
}})

/**
 * @name $jin.bench.app#sources
 * @method sources
 * @member $jin.bench.app
 */
$jin.atom.prop({ '$jin.bench.app..sources': {
	pull: function( ){
		return $jin.state.url.item( 'source' ) || []
	},
	put: function( next ){
		$jin.state.url.item( 'source', next )
		return next
	}
}})

/**
 * @name $jin.bench.app#cases
 * @method cases
 * @member $jin.bench.app
 */
$jin.method({ '$jin.bench.app..cases': function( ){
	return this.sources().map( function( code, index ){
		return this.child( 'row=' + index, $jin.bench.case ).index( index )
	}.bind( this ) )
}})

/**
 * @name $jin.bench.app#run
 * @method run
 * @member $jin.bench.app
 */
$jin.method({ '$jin.bench.app..run': function( ){
	var measures = $jin.bench( this.sources() )
	var cases = this.cases()
	measures.forEach( function( measure, index ){
		cases[ index ].measure( measure )
	} )
}})