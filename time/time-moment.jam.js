/**
 * @name $jin.time.moment
 * @class $jin.time.moment
 * @mixins $jin.klass
 * @returns $jin.time.moment
 */
$jin.klass({ '$jin.time.moment': [] })

/**
 * @name $jin.time.moment#nativeDate
 * @method nativeDate
 * @member $jin.time.moment
 */
$jin.method({ '$jin.time.moment..nativeDate': function( date ){
	if( arguments.length ){
		this.year( date.getFullYear() )
		this.month( date.getMonth() )
		this.day( date.getDate() )
		this.hour( date.getHour() )
		this.minute( date.getMinutes() )
		this.second( date.getSeconds() )
		this.millisecond( date.getMilliseconds() )
		this.offset( data.getTimezoneOffset() )
	} else {
		return new Date(
			this.year(),
			this.month(),
			this.day() + 1,
			this.hour(),
			this.minute(),
			this.second(),
			this.millisecond()
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
		if( !isNaN( this.offset() ) ) pattern += 'zone'
	}
	return $jin.time.format( pattern )( this )
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
 */
$jin.property({ '$jin.time.moment..offset': $jin.time.period })
