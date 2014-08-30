/**
 * @name $jin.bench.case
 * @class $jin.bench.case
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.bench.case
 */
$jin.klass({ '$jin.bench.case': [ '$jin.view' ] })

/**
 * @name $jin.bench.case#index
 * @method index
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..index': {
	merge: $jin.ensure.number.range( 0, null )
}})

/**
 * @name $jin.bench.case#source
 * @method source
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..source': {
	pull: function( ){
		return this.parent().sources()[ this.index() ]
	},
	put: function( next ){
		var sources = this.parent().sources().slice()
		sources[ this.index() ] = next
		this.parent().sources( sources )
		return next
	}
}})

/**
 * @name $jin.bench.case#title
 * @method title
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..title': {
	pull: function( ){
		return [ this.child( 'title', $jin.field ).label( 'Case title' ).valueProp( function(){} ) ]
	}
}})

/**
 * @name $jin.bench.case#code
 * @method code
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..code': {
	pull: function( ){
		return [ this.child( 'code', $jin.field ).label( 'Case source' ).valueProp( this.source.bind( this ) ) ]
	}
}})

/**
 * @name $jin.bench.case#measure
 * @method measure
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..measure': {
	pull: function(){
		return this.parent().measures()[ this.index() ] || { inner: {}, outer: {} }
	}
}})

/**
 * @name $jin.bench.case#measureExecuteInner
 * @method measureExecuteInner
 * @member $jin.bench.case
 */
$jin.method({ '$jin.bench.case..measureExecuteInner': function( ){
	var value = this.measure().inner.execute
	if( value == null ) return '...'

	return value.toFixed( 2 ) + ' μs'
}})

/**
 * @name $jin.bench.case#measureCompileInner
 * @method measureCompileInner
 * @member $jin.bench.case
 */
$jin.method({ '$jin.bench.case..measureCompileInner': function( ){
	var value = this.measure().inner.compile
	if( value == null ) return '...'

	return value.toFixed( 2 ) + ' μs'
}})

/**
 * @name $jin.bench.case#measureExecuteOuter
 * @method measureExecuteOuter
 * @member $jin.bench.case
 */
$jin.method({ '$jin.bench.case..measureExecuteOuter': function( ){
	var value = this.measure().outer.execute
	if( value == null ) return '...'

	return value.toFixed( 2 ) + ' μs'
}})

/**
 * @name $jin.bench.case#measureCompileOuter
 * @method measureCompileOuter
 * @member $jin.bench.case
 */
$jin.method({ '$jin.bench.case..measureCompileOuter': function( ){
	var value = this.measure().outer.compile
	if( value == null ) return '...'

	return value.toFixed( 2 ) + ' μs'
}})
