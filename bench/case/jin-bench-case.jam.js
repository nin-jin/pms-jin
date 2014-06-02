/**
 * @name $jin.bench.case
 * @class $jin.bench.case
 * @mixins $jin.klass
 * @mixins $jin.view2
 * @returns $jin.bench.case
 */
$jin.klass({ '$jin.bench.case': [ '$jin.view2' ] })

/**
 * @name $jin.bench.case#index
 * @method index
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..index': {
	merge: $jin.ensure.number.range( 0, null )
}})

/**
 * @name $jin.bench.case#code
 * @method code
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..code': {
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
 * @name $jin.bench.case#editor
 * @method editor
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..editor': {
	pull: function( ){
		return this.child( 'editor', $jin.editor ).valueProp( this.code.bind( this ) )
	}
}})

/**
 * @name $jin.bench.case#barSize
 * @method barSize
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..barSize': {
	pull: function( ){
		return '50%'
	}
}})

/**
 * @name $jin.bench.case#measure
 * @method measure
 * @member $jin.bench.case
 */
$jin.atom.prop({ '$jin.bench.case..measure': {
	pull: function(){
		this.code()
		return { outer: {}, inner: {} }
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
