/**
 * @name $jin.bench.app
 * @class $jin.bench.app
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.bench.app
 */
$jin.klass({ '$jin.bench.app': [ '$jin.view' ] })

/**
 * @name $jin.bench.app#setupCode
 * @method setupCode
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..setupCode': {
	pull: function( ){
		return ( $jin.state.url.item( 'setup' ) || [] ).join( '' )
	},
	put: function( next ){
		$jin.state.url.item( 'setup', next )
		return next
	}
}})

/**
 * @name $jin.bench.app#tearDownCode
 * @method tearDownCode
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..tearDownCode': {
	pull: function( ){
		return ( $jin.state.url.item( 'teardown' ) || [] ).join( '' )
	},
	put: function( next ){
		$jin.state.url.item( 'teardown', next )
		return next
	}
}})

/**
 * @name $jin.bench.app#titleEditor
 * @method titleEditor
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..titleEditor': {
	pull: function( ){
		return [ this.child( 'title', $jin.field ).label( 'Benchmark title' ).valueProp( function(){} ) ]
	}
}})

/**
 * @name $jin.bench.app#setup
 * @method setup
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..setup': {
	pull: function( ){
		return [ this.child( 'setup', $jin.field ).label( 'Set Up' ).valueProp( this.setupCode.bind( this ) ) ]
	}
}})

/**
 * @name $jin.bench.app#tearDown
 * @method tearDown
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..tearDown': {
	pull: function( ){
		return [ this.child( 'tearDown', $jin.field ).label( 'Tear Down' ).valueProp( this.tearDownCode.bind( this ) ) ]
	}
}})

/**
 * @name $jin.bench.app#sources
 * @method sources
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..sources': {
	pull: function( ){
		var next = $jin.state.url.item( 'source' ) || [ 'with({ a: 1 }){\n/*in*/\n    a\n/*out*/\n}' ]
		next = next.filter( function( source ){
			return source
		} )
		next.push( '' )
		return next
	},
	put: function( next ){
		$jin.state.url.item( 'source', next )
		return next
	}
}})

/**
 * @name $jin.bench.app#measures
 * @method measures
 * @member $jin.bench.app
 */
$jin.atom1.prop({ '$jin.bench.app..measures': {
	pull: function(){
		return []
	}
}})

/**
 * @name $jin.bench.app#cases
 * @method cases
 * @member $jin.bench.app
 */
$jin.method({ '$jin.bench.app..cases': function( ){
	return this.sources().map( function( code, index ){
		return this.child( 'case=' + index, $jin.bench.case ).index( index )
	}.bind( this ) )
}})

/**
 * @name $jin.bench.app#run
 * @method run
 * @member $jin.bench.app
 */
$jin.method({ '$jin.bench.app..run': function( ){
	this.measures( $jin.bench( this.setupCode(), this.sources(), this.tearDownCode() ) )
}})
