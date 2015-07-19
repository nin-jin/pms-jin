/**
 * @name $jin.time1.moment
 * @class $jin.time1.moment
 * @mixins $jin.klass
 * @returns $jin.time1.moment
 */
$jin.klass({ '$jin.time1.moment': [] })

/**
 * @name $jin.time1.moment.exec
 * @method exec
 * @member $jin.time1.moment
 * @static
 */
$jin.method({ '$jin.time1.moment.exec': function( time ){
	if( !arguments.length ) time = new Date
	if( time instanceof this ) return time
	switch( $jin_type( time ) ){
		case 'Number':
			time = new Date( time )
		case 'Date':
			return this['$jin.klass.exec']({ nativeDate: time })
		case 'String':
			var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d\d\d))?)?)?(Z|[\+\-]\d\d(?::?(?:\d\d)?)?)?)?$/.exec( time )
			if( !parsed ) throw new Error( 'Can not parse time moment (' + time + ')' )

			var moment = this['$jin.klass.exec']({
				year: parsed[1],
				month: parsed[2] && ( parsed[2] - 1 ),
				day: parsed[3] && ( parsed[3] - 1 ),
				hour: parsed[4],
				minute: parsed[5],
				second: parsed[6],
				millisecond: parsed[7],
				offset: parsed[8] && $jin.time1.period( parsed[8] )
			})

			return moment
		case 'Object':
			if( time instanceof this ) return time
			return this['$jin.klass.exec']( time )
		default:
			throw new Error( 'Wrong type of time moment (' + $jin_type( time ) + ')' )
	}
}})

$jin.method({ '$jin.time1.moment..json': function( json ){
    if( arguments.length ) {
        if( typeof json === 'string' ) json = $jin.time1.moment( json ).json()
        return this['$jin.klass..json']( json )
    }

    var json = {}

    if( this.year() !== undefined ) json.year = this.year()
    if( this.month() !== undefined ) json.month = this.month()
    if( this.day() !== undefined ) json.day = this.day()
    if( this.hour() !== undefined ) json.hour = this.hour()
    if( this.minute() !== undefined ) json.minute = this.minute()
    if( this.second() !== undefined ) json.second = this.second()
    if( this.millisecond() !== undefined ) json.millisecond = this.millisecond()
    if( this.offset() !== undefined ) json.offset = this.offset()

    return json
}})

/**
 * @name $jin.time1.moment#nativeDate
 * @method nativeDate
 * @member $jin.time1.moment
 */
$jin.method({ '$jin.time1.moment..nativeDate': function( date ){
	if( arguments.length ){
		this.year( date.getFullYear() )
		this.month( date.getMonth() )
		this.day( date.getDate() - 1 )
		this.hour( date.getHours() )
		this.minute( date.getMinutes() )
		this.second( date.getSeconds() )
		this.millisecond( date.getMilliseconds() )
		var offset = - date.getTimezoneOffset()
		this.offset({
			hours : ( offset < 0 ) ? Math.ceil( offset / 60 ) : Math.floor( offset / 60 ),
			minutes : offset % 60
		} )
	} else {
        var utc = this.toTimeZone('Z')
		return new Date( Date.UTC(
            utc.year() || 0,
            utc.month() || 0,
            ( utc.day() || 0 ) + 1,
            utc.hour() || 0,
            utc.minute() || 0,
            utc.second() || 0,
            utc.millisecond() || 0
        ) )
	}
}})

/**
 * @name $jin.time1.moment#toString
 * @method toString
 * @member $jin.time1.moment
 */
$jin.method({ '$jin.time1.moment..toString': function( pattern ){
	if( !pattern ){
		pattern = ''
		if( !isNaN( this.year() ) ) pattern += 'YYYY'
		if( !isNaN( this.month() ) ) pattern += '-MM'
		if( !isNaN( this.day() ) ) pattern += '-DD'
		if( !isNaN( this.hour() ) ) pattern += 'Thh'
		if( !isNaN( this.minute() ) ) pattern += ':mm'
		if( !isNaN( this.second() ) ) pattern += ':ss'
		if( !isNaN( this.millisecond() ) ) pattern += '.sss'
		if( this.offset() ) pattern += 'ZZ'
	}
	return $jin.time1.format( pattern )( this )
}})

$jin.method({ '$jin.time1.moment..valueOf': function(){
    return this.nativeDate().getTime()
}})

$jin.method({ '$jin.time1.moment..toJSON': function(){
    return this.toString()
}})

/**
 * @name $jin.time1.moment#shift
 * @method shift
 * @member $jin.time1.moment
 */
$jin.method({ '$jin.time1.moment..shift': function( period ){
	period = $jin.time1.period( period )

	var year = ( this.year() || 0 ) + ( period.years() || 0 )
	var month = ( this.month() || 0 ) + ( period.months() || 0 )
	var day = ( this.day() || 0 ) + ( period.days() || 0 )
	var hour = ( this.hour() || 0 ) + ( period.hours() || 0 )
	var minute = ( this.minute() || 0 ) + ( period.minutes() || 0 )
	var second = ( this.second() || 0 ) + ( period.seconds() || 0 )
	
	var date = new Date( year, month, day + 1, Math.floor( hour ), minute + ( hour - Math.floor( hour ) ) * 60 , second )
	
	var time = $jin.time1.moment({})
	
	if( year || !isNaN( this.year() ) ) time.year( date.getFullYear() )
	if( month || !isNaN( this.month() ) ) time.month( date.getMonth() )
	if( day || !isNaN( this.day() ) ) time.day( date.getDate() - 1 )
	if( hour || !isNaN( this.hour() ) ) time.hour( date.getHours() )
	if( minute || !isNaN( this.minute() ) ) time.minute( date.getMinutes() )
	if( second || !isNaN( this.second() ) ) time.second( date.getSeconds() )
	if( this.offset() ) time.offset( this.offset() )

	return time
}})

/**
 * @name $jin.time1.moment#clone
 * @method clone
 * @member $jin.time1.moment
 */
$jin.method({ '$jin.time1.moment..clone': function( ){
	return $jin.time1.moment({
		year: this.year(),
		month: this.month(),
		day: this.day(),
		hour: this.hour(),
		minute: this.minute(),
		second: this.second(),
		millisecond: this.millisecond(),
		offset : this.offset()
	})
}})

/**
 * @name $jin.time1.moment#year
 * @method year
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..year': $jin.ensure.number.range( 0, 3000 ) })

/**
 * @name $jin.time1.moment#month
 * @method month
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..month': $jin.ensure.number.range( 0, 11 ) })

/**
 * @name $jin.time1.moment#weekDay
 * @method weekDay
 * @member $jin.time1.moment
 */
$jin.method({ '$jin.time1.moment..weekDay': function( ){
	return this.nativeDate().getDay()
}})

/**
 * @name $jin.time1.moment#day
 * @method day
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..day': $jin.ensure.number.range( 0, 30 ) })

/**
 * @name $jin.time1.moment#hour
 * @method hour
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..hour': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time1.moment#minute
 * @method minute
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..minute': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time1.moment#second
 * @method second
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..second': $jin.ensure.number.range( 0, 60 ) })

/**
 * @name $jin.time1.moment#millisecond
 * @method millisecond
 * @member $jin.time1.moment
 */
$jin.property({ '$jin.time1.moment..millisecond': $jin.ensure.number.range( 0, 1000 ) })

/**
 * @name $jin.time1.moment#offset
 * @method offset
 * @member $jin.time1.moment
 //*/
$jin.property({ '$jin.time1.moment..offset': function( offset ) {
	if( !offset ) return offset
	return $jin.time1.period( offset )
} })

$jin.method({ '$jin.time1.moment..toTimeZone': function( zone ) {
	if( this.offset() ) {
		return this.shift( $jin.time1.period( zone ).sub( this.offset() ) ).offset( zone )
	} else {
		return this.clone().offset( zone )
	}
} })
