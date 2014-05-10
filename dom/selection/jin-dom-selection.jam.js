/**
 * @name $jin.dom.selection
 * @class $jin.dom.selection
 * @returns $jin.dom.selection
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.dom.selection': [ '$jin.wrapper' ] })

$jin.alias( '$jin.wrapper..raw', '$jin.dom.selection..raw', 'nativeSelection' )

/**
 * @name $jin.dom.selection#nativeSelection
 * @method nativeSelection
 * @member $jin.dom.selection
 */
$jin.property({ '$jin.dom.selection..nativeSelection': null })

/**
 * @name $jin.dom.selection#clear
 * @method clear
 * @member $jin.dom.selection
 */
$jin.method({ '$jin.dom.selection..clear': function( ){
	var sel = this.nativeSelection()
	if( sel.removeAllRanges ) sel.removeAllRanges()
	else if( sel.clear ) sel.clear()
	else throw new Error( 'Unsupported selection type' )
	
	return this
}})

/**
 * @name $jin.dom.selection#range
 * @method range
 * @member $jin.dom.selection
 */
$jin.method({ '$jin.dom.selection..range': function( ){
	var sel = this.nativeSelection()
	if( sel.rangeCount ) return $jin.dom.range( sel.getRangeAt( 0 ).cloneRange() )
	if( document.createRange ) return $jin.dom.range( document.createRange() )
	if( sel.createRange ) return $jin.dom.range( sel.createRange() )
	throw new Error( 'Unsupported selection type' )
}})
