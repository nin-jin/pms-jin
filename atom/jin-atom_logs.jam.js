/**
 * @name $jin.atom.enableLogs
 * @method enableLogs
 * @static
 * @member $jin.atom
 */
$jin.method({ '$jin.atom.enableLogs': function( ){
	$jin.mixin({ '$jin.atom': [ '$jin.atom.logging' ] })
}})

/**
 * @name $jin.atom.logging#notify
 * @method notify
 * @member $jin.atom.logging
 */
$jin.method({ '$jin.atom.logging..notify': function( ){
	var ctor = this.constructor

	ctor.log().push([ this._config.name || this._id, this._value, this._masters ])

	if( !ctor._deferedLogging ){
		ctor._deferedLogging = $jin.schedule( 0, function defferedLogging( ){
			ctor._deferedLogging = null
			if( console.groupCollapsed ) console.groupCollapsed('$jin.atom.log')
			ctor.log().forEach( function jin_atom_defferedLog( row ){
				$jin.log.apply( $jin, row )
			} )
			if( console.groupEnd ) console.groupEnd('$jin.atom.log')
			ctor.log( [] )
		} )
	}

	return this[ '$jin.atom..notify' ]()
}})

/**
 * @name $jin.atom.logging.log
 * @method log
 * @static
 * @member $jin.atom.logging
 */
$jin.property({ '$jin.atom.logging.log': function( ){
	return []
}})
