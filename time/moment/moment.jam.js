/**
 * @name $jin.time.moment
 * @class $jin.time.moment
 * @mixins $jin.klass
 * @returns $jin.time.moment
 */
$jin.klass({ '$jin.time.moment': [] })

/**
 * @name $jin.time.moment.exec
 * @method exec
 * @member $jin.time.moment
 * @static
 */
$jin.method({ '$jin.time.moment.exec': function( time ){
	if( !arguments.length ) time = new Date
	switch( $jin.type( time ) ){
		case 'Number':
			time = new Date( time )
		case 'Date':
			return this['$jin.klass.exec']({ nativeDate: time })
		case 'String':
			var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d\d\d))?)?)?(Z|[\+\-](\d\d)(?::?(\d\d)?)?)?)?$/.exec( time )
			if( !parsed ) throw new Error( 'Can not parse time moment (' + time + ')' )
			
			return this['$jin.klass.exec']({
				year: parsed[1],
				month: parsed[2] && ( parsed[2] - 1 ),
				day: parsed[3] && ( parsed[3] - 1 ),
				hour: parsed[4],
				minute: parsed[5],
				second: parsed[6],
				millisecond: parsed[7]/*,
				offset: parsed[8]*/
			})
		case 'Object':
			if( time instanceof this ) return time
			return this['$jin.klass.exec']( time )
		default:
			throw new Error( 'Wrong type of time moment (' + $jin.type( time ) + ')' )
	}
}})

/**
 * @name $jin.time.moment#nativeDate
 * @method nativeDate
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..nativeDate': function( date ){
	if( arguments.length ){
		this.year( date.getFullYear() )
		this.month( date.getMonth() )
		this.day( date.getDate() - 1 )
		this.hour( date.getHours() )
		this.minute( date.getMinutes() )
		this.second( date.getSeconds() )
		this.millisecond( date.getMilliseconds() )
		//this.offset( data.getTimezoneOffset() )
	} else {
		return new Date(
			this.year() || 0,
			this.month() || 0,
			this.day() + 1 || 1,
			this.hour() || 0,
			this.minute() || 0,
			this.second() || 0,
			this.millisecond() || 0
		)
	}
}})

/**
 * @name $jin.time.moment#toString
 * @method toString
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..toString': function( pattern ){
	if( !pattern ){
		pattern = ''
		if( !isNaN( this.year() ) ) pattern += 'YYYY'
		if( !isNaN( this.month() ) ) pattern += '-MM'
		if( !isNaN( this.day() ) ) pattern += '-DD'
		if( !isNaN( this.hour() ) ) pattern += 'Thh'
		if( !isNaN( this.minute() ) ) pattern += ':mm'
		if( !isNaN( this.second() ) ) pattern += ':ss'
		if( !isNaN( this.millisecond() ) ) pattern += '.sss'
		//if( !isNaN( this.offset() ) ) pattern += 'zone'
	}
	return $jin.time.format( pattern )( this )
}})

/**
 * @name $jin.time.moment#shift
 * @method shift
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..shift': function( period ){
	period = $jin.time.period( period )
	
	var year = ( this.year() | 0 ) + ( period.years() | 0 )
	var month = ( this.month() | 0 ) + ( period.months() | 0 )
	var day = ( this.day() | 0 ) + ( period.days() | 0 )
	var hour = ( this.hour() | 0 ) + ( period.hours() | 0 )
	var minute = ( this.minute() | 0 ) + ( period.minutes() | 0 )
	var second = ( this.second() | 0 ) + ( period.seconds() | 0 )
	
	var date = new Date( year, month, day + 1, hour, minute, second )
	
	var time = $jin.time.moment({})
	
	if( !isNaN( this.year() ) ) time.year( date.getFullYear() )
	if( !isNaN( this.month() ) ) time.month( date.getMonth() )
	if( !isNaN( this.day() ) ) time.day( date.getDate() - 1 )
	if( !isNaN( this.hour() ) ) time.hour( date.getHours() )
	if( !isNaN( this.minute() ) ) time.minute( date.getMinutes() )
	if( !isNaN( this.second() ) ) time.second( date.getSeconds() )
	
	return time
}})

/**
 * @name $jin.time.moment#clone
 * @method clone
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..clone': function( ){
	return $jin.time.moment({
		year: this.year(),
		month: this.month(),
		day: this.day(),
		hour: this.hour(),
		minute: this.minute(),
		second: this.second(),
		millisecond: this.millisecond()
	})
}})

/**
 * @name $jin.time.moment#year
 * @method year
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..year': $jin.ensure.number.range( 0, 3000 ) })

/**
 * @name $jin.time.moment#month
 * @method month
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..month': $jin.ensure.number.range( 0, 11 ) })

/**
 * @name $jin.time.moment#weekDay
 * @method weekDay
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..weekDay': function( ){
	return this.nativeDate().getDay()
}})

/**
 * @name $jin.time.moment#day
 * @method day
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..day': $jin.ensure.number.range( 0, 30 ) })

/**
 * @name $jin.time.moment#hour
 * @method hour
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..hour': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#minute
 * @method minute
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..minute': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#second
 * @method second
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..second': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time.moment#millisecond
 * @method millisecond
 * @member $jin.time.moment
 */
$jin.property({ '$jin.time.moment..millisecond': $jin.ensure.number.range( 0, 1000 ) })

/**
 * @name $jin.time.moment#offset
 * @method offset
 * @member $jin.time.moment
 //*/
//$ jin.property({ '$jin.time.moment..offset': $jin.time.period })
