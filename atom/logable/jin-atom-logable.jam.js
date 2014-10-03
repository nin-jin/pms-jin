/**
 * @name $jin.atom.logable#notify
 * @method notify
 * @member $jin.atom.logable
 */
$jin.method({ '$jin.atom.logable..notify': function( next, prev ){

	$jin.atom.logable.history().push([ this._name, '=', this._value/*, this*/ ])

	$jin.atom.logable.deferLog()

	return ( this[ '$jin.atom.pushable..notify' ] || this[ '$jin.atom.variable..notify' ] ).call( this, next, prev )
}})

/**
 * @name $jin.atom.logable.history
 * @method history
 * @static
 * @member $jin.atom.logable
 */
$jin.property({ '$jin.atom.logable.history': function( ){
	return []
}})

/**
 * @name $jin.atom.logable.deferLog
 * @method deferLog
 * @member $jin.atom.logable
 * @static
 */
$jin.property({ '$jin.atom.logable.deferLog': function( next  ){
	if( arguments.length ) return next
	
	return new $jin.schedule( 0, function defferedLogging( ){
		this.deferLog( void 0 )
		
		if( console.groupCollapsed ) console.groupCollapsed( '$jin.atom.logable' )
		
		this.history().forEach( function jin_atom_defferedLog( row ){
			$jin.log.apply( $jin, row )
		} )
		this.history( [] )
		
		if( console.groupEnd ) console.groupEnd( '$jin.atom.logable' )
		
	}.bind( this ) )
}})
