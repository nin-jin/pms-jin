/**
 * @name $jin.time.period
 * @class $jin.time.period
 * @mixins $jin.klass
 * @mixins $jin.vector
 * @returns $jin.time.period
 */
$jin.klass({ '$jin.time.period': [ '$jin.vector' ] })

/**
 * @name $jin.time.period.exec
 * @method exec
 * @member $jin.time.period
 * @static
 */
$jin.method({ '$jin.time.period.exec': function( period ){
	if( !arguments.length ) period = []
	switch( $jin.type( period ) ){
		case 'Number':
			period = [ 0, 0, 0, 0, 0, period ]
		case 'Object':
			if( period instanceof this ) return period;
		case 'Array':
			return this['$jin.klass.exec']( period )
		case 'String':
			var parser = /^P(?:([+-]?\d+(?:\.\d+)?)Y)?(?:([+-]?\d+(?:\.\d+)?)M)?(?:([+-]?\d+(?:\.\d+)?)D)?(?:T(?:([+-]?\d+(?:\.\d+)?)h)?(?:([+-]?\d+(?:\.\d+)?)m)?(?:([+-]?\d+(?:\.\d+)?)s)?)?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = found.slice( 1 ).map( function( val ){
					return Number( val ) || 0
				} )
				
				return this['$jin.klass.exec']( items )
			}
			
			var parser = /^[+-](\d+)(?::(\d+))?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = [ 0, 0, 0, found[1] | 0, found[2] | 0, 0 ]
				
				return this['$jin.klass.exec']( items )
			}
			
			throw new Error( 'Can not parse time period (' + period + ')' )
		case 'String':
			return this['$jin.wrapper.exec']( period )
		default:
			throw new Error( 'Wrong type of time period (' + $jin.type( period ) + ')' )
	}
}})

/**
 * @name $jin.time.period#toString
 * @method toString
 * @member $jin.time.period
 */
$jin.method({ '$jin.time.period..toString': function( pattern ){
	if( !pattern ){
		pattern = 'P'
		if( this.years() ) pattern += '#Y'
		if( this.months() ) pattern += '#M'
		if( this.days() ) pattern += '#D'
		
		var timePattern = ''
		if( this.hours() ) timePattern += '#h'
		if( this.minutes() ) timePattern += '#m'
		if( this.seconds() ) timePattern += '#s'
		
		if( timePattern ) pattern += 'T' + timePattern
	}
	return $jin.time.format( pattern )( this )
}})

/**
 * @name $jin.time.period#years
 * @method years
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..years': function( value ){
	if( arguments.length ) this.raw()[0] = value
	return this.raw()[0]
}})

/**
 * @name $jin.time.period#months
 * @method months
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..months': function( value ){
	if( arguments.length ) this.raw()[1] = value
	return this.raw()[1]
}})

/**
 * @name $jin.time.period#days
 * @method days
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..days': function( value ){
	if( arguments.length ) this.raw()[2] = value
	return this.raw()[2]
}})

/**
 * @name $jin.time.period#hours
 * @method hours
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..hours': function( value ){
	if( arguments.length ) this.raw()[3] = value
	return this.raw()[3]
}})

/**
 * @name $jin.time.period#minutes
 * @method minutes
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..minutes': function( value ){
	if( arguments.length ) this.raw()[4] = value
	return this.raw()[4]
}})

/**
 * @name $jin.time.period#seconds
 * @method seconds
 * @member $jin.time.period
 */
$jin.property({ '$jin.time.period..seconds': function( value ){
	if( arguments.length ) this.raw()[5] = value
	return this.raw()[5]
}})
