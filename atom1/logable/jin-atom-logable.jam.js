/**
 * @name $jin.atom1.logable#notify
 * @method notify
 * @member $jin.atom1.logable
 */
$jin.method({ '$jin.atom1.logable..notify': function( next, prev ){

	$jin.atom1.logable.history().push([ this._name, '=', this._value/*, this*/ ])

	$jin.atom1.logable.deferLog()

	return ( this[ '$jin.atom1.pushable..notify' ] || this[ '$jin.atom1.variable..notify' ] ).call( this, next, prev )
}})

/**
 * @name $jin.atom1.logable.history
 * @method history
 * @static
 * @member $jin.atom1.logable
 */
$jin.property({ '$jin.atom1.logable.history': function( ){
	return []
}})

/**
 * @name $jin.atom1.logable.deferLog
 * @method deferLog
 * @member $jin.atom1.logable
 * @static
 */
$jin.property({ '$jin.atom1.logable.deferLog': function( next  ){
	if( arguments.length ) return next
	
	return new $jin.schedule( 0, function defferedLogging( ){
		this.deferLog( void 0 )
		
		if( console.groupCollapsed ) console.groupCollapsed( '$jin.atom1.logable' )
		
		this.history().forEach( function jin_atom_defferedLog( row ){
			$jin.log.apply( $jin, row )
		} )
		this.history( [] )
		
		if( console.groupEnd ) console.groupEnd( '$jin.atom1.logable' )
		
	}.bind( this ) )
}})
