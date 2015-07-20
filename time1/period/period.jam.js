/**
 * @name $jin.time1.period
 * @class $jin.time1.period
 * @mixins $jin.klass
 * @mixins $jin.vector
 * @returns $jin.time1.period
 */
$jin.klass({ '$jin.time1.period': [ '$jin.vector' ] })

/**
 * @name $jin.time1.period.exec
 * @method exec
 * @member $jin.time1.period
 * @static
 */
$jin.method({ '$jin.time1.period.exec': function( period ){
	if( !arguments.length ) period = []
	if( period instanceof this ) return period
	switch( $jin_type( period ) ){
		case 'Number':
			return this['$jin.klass.exec']( [ 0, 0, 0, 0, 0, period / 1000 ] )
		case 'Object':
			if( period instanceof this ) return period;
			return this['$jin.klass.exec']([
				period.years,
				period.months,
				period.days,
				period.hours,
				period.minutes,
				period.seconds
			])
		case 'Array':
			return this['$jin.klass.exec']( period )
		case 'String':
			if( period === 'Z' ) {
				return this['$jin.klass.exec']([ 0 , 0 , 0 , 0 , 0 , 0 ])
			}

			var parser = /^P(?:([+-]?\d+(?:\.\d+)?)Y)?(?:([+-]?\d+(?:\.\d+)?)M)?(?:([+-]?\d+(?:\.\d+)?)D)?(?:T(?:([+-]?\d+(?:\.\d+)?)h)?(?:([+-]?\d+(?:\.\d+)?)m)?(?:([+-]?\d+(?:\.\d+)?)s)?)?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = found.slice( 1 ).map( function( val ){
					return Number( val ) || 0
				} )
				
				return this['$jin.klass.exec']( items )
			}

            var parser = /^[+-](\d\d)(?::?(\d\d))?$/i
			var found = parser.exec( period )
			if( found ){
				
				var items = [ 0, 0, 0, found[1] | 0, found[2] | 0, 0 ]
				
				return this['$jin.klass.exec']( items )
			}
			
			throw new Error( 'Can not parse time period (' + period + ')' )
		case 'String':
			return this['$jin.wrapper.exec']( period )
		default:
			throw new Error( 'Wrong type of time period (' + $jin_type( period ) + ')' )
	}
}})

/**
 * @name $jin.time1.period#toString
 * @method toString
 * @member $jin.time1.period
 */
$jin.method({ '$jin.time1.period..toString': function( pattern ){
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

		return $jin.time1.format( pattern )( this ).toUpperCase()
	}
	return $jin.time1.format( pattern )( this )
}})

$jin.method({ '$jin.time1.period..valueOf': function( ){
    var days = this.years() * 365 + this.months() * 30 + this.days()
    var seconds = ( ( days * 24 + this.hours() ) * 60 + this.minutes() ) * 60 + this.seconds()
    return seconds * 1000
}})

$jin.method({ '$jin.time1.period..toJSON': function( ){
    return this.toString()
}})

/**
 * @name $jin.time1.period#years
 * @method years
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..years': function( value ){
	if( arguments.length ) this.raw()[0] = value
	return this.raw()[0] || 0
}})

/**
 * @name $jin.time1.period#months
 * @method months
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..months': function( value ){
	if( arguments.length ) this.raw()[1] = value
	return this.raw()[1] || 0
}})

/**
 * @name $jin.time1.period#days
 * @method days
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..days': function( value ){
	if( arguments.length ) this.raw()[2] = value
	return this.raw()[2] || 0
}})

/**
 * @name $jin.time1.period#hours
 * @method hours
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..hours': function( value ){
	if( arguments.length ) this.raw()[3] = value
	return this.raw()[3] || 0
}})

/**
 * @name $jin.time1.period#minutes
 * @method minutes
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..minutes': function( value ){
	if( arguments.length ) this.raw()[4] = value
	return this.raw()[4] || 0
}})

/**
 * @name $jin.time1.period#seconds
 * @method seconds
 * @member $jin.time1.period
 */
$jin.property({ '$jin.time1.period..seconds': function( value ){
	if( arguments.length ) this.raw()[5] = value
	return this.raw()[5] || 0
}})
