module $jin.time {

	export interface moment_iconfig {
		year? : number | string
		month? : number | string
		day? : number | string
		hour? : number | string
		minute? : number | string
		second? : number | string
		offset? : number | number[] | string | $jin.time.duration_iconfig
	}

	export class moment_class extends $jin.time.base_class {

		static duration_class = $jin.time.duration_class

		static make( moment? : number | number[] | Date | string | moment_iconfig ) {
			if( !arguments.length ) moment = new Date

			var type = $jin_type( moment )
			switch( type ){

				case 'Number':
					moment = new Date( <number>moment )

				case 'Date':
					var native = <Date>moment
					var offset = - native.getTimezoneOffset()
					return new (<typeof moment_class>this)( {
						year : native.getFullYear(),
						month : native.getMonth(),
						day : native.getDate() - 1,
						hour : native.getHours(),
						minute : native.getMinutes(),
						second : native.getSeconds() + native.getMilliseconds() / 1000,
						offset : {
							hour : ( offset < 0 ) ? Math.ceil( offset / 60 ) : Math.floor( offset / 60 ) ,
							minute : offset % 60
						}
					} )

				case 'String':
					var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:[T ](\d\d)(?::?(\d\d)(?::?(\d\d(?:\.\d\d\d)?))?)?(Z|[\+\-]\d\d(?::?(?:\d\d)?)?)?)?$/.exec( <string>moment )
					if( !parsed ) throw new Error( 'Can not parse time moment (' + <string>moment + ')' )

					return new (<typeof moment_class>this)({
						year: parsed[1],
						month: parsed[2] ? ( Number( parsed[2] ) - 1 ) : void 0,
						day: parsed[3] ? ( Number( parsed[3] ) - 1 ) : void 0,
						hour: parsed[4],
						minute: parsed[5],
						second: parsed[6],
						offset: parsed[7]
					})

				case 'Array':
					return new (<typeof moment_class>this)({
						year: moment[0],
						month: moment[1],
						day: moment[2],
						hour: moment[3],
						minute: moment[4],
						second: moment[5],
						offset: moment[6],
					})

				case 'Object':
					if( moment instanceof this ) return moment
					return new (<typeof moment_class>this)( <moment_iconfig>moment )

				default:
					throw new Error( 'Wrong type of time moment (' + type + ')' )

			}

		}

		private _year : number
		get year(){ return this._year }

		private _month : number
		get month(){ return this._month }

		private _day : number
		get day(){ return this._day }

		private _hour : number
		get hour(){ return this._hour }

		private _minute : number
		get minute(){ return this._minute }

		private _second : number
		get second(){ return this._second }

		private _offset : $jin.time.duration_class
		get offset(){ return this._offset }

		constructor( config : moment_iconfig ) {
			super()
			this._year = config.year && Number( config.year )
			this._month = config.month && Number( config.month )
			this._day = config.day && Number( config.day )
			this._hour = config.hour && Number( config.hour )
			this._minute = config.minute && Number( config.minute )
			this._second = config.second && Number( config.second )
			this._offset = config.offset && (<typeof moment_class>this.constructor).duration_class.make( config.offset )
			this._native = null
		}

		private _native : Date
		get native() {
			if( this._native ) return this._native
			var utc = this.toOffset( 'Z' )
			return this._native = new Date( Date.UTC(
				utc.year || 0,
				utc.month || 0,
				( utc.day || 0 ) + 1,
				utc.hour || 0,
				utc.minute || 0,
				utc.second && Math.ceil( utc.second ) || 0,
				utc.second && ( utc.second - Math.ceil( utc.second ) ) || 0
			) )
		}

		get normal() {
			return (<typeof moment_class>this.constructor).make( this.native ).merge({
				year : ( this._year === void 0 ) ? null : void 0 ,
				month : ( this._month === void 0 ) ? null : void 0 ,
				day : ( this._day === void 0 ) ? null : void 0 ,
				hour : ( this._hour === void 0 ) ? null : void 0 ,
				minute : ( this._minute === void 0 ) ? null : void 0 ,
				second : ( this._second === void 0 ) ? null : void 0 ,
				offset : ( this._offset === void 0 ) ? null : void 0 ,
			})
		}

		get weekDay() {
			return this.native.getDay()
		}

		merge( config : number | number[] | Date | string | moment_iconfig ) {
			var Moment = <typeof moment_class>this.constructor
			var moment = Moment.make( config )
			return new Moment({
				year : ( moment.year === void 0 )
					? this._year
					: ( moment.year === null )
					? void 0
					: moment.year,
				month : ( moment.month === void 0 )
					? this._month
					: ( moment.month === null )
					? void 0
					: moment.month,
				day : ( moment.day === void 0 )
					? this._day
					: ( moment.day === null )
					? void 0
					: moment.day,
				hour : ( moment.hour === void 0 )
					? this._hour
					: ( moment.hour === null )
					? void 0
					: moment.hour,
				minute : ( moment.minute === void 0 )
					? this._minute
					: ( moment.minute === null )
					? void 0
					: moment.minute,
				second : ( moment.second === void 0 )
					? this._second
					: ( moment.second === null )
					? void 0
					: moment.second,
				offset : ( moment.offset === void 0 )
					? this._offset
					: ( moment.offset === null )
					? void 0
					: moment.offset ,
			})
		}

		shift( config : number | number[] | string | $jin.time.duration_iconfig ) {
			var Moment = <typeof moment_class>this.constructor
			var duration = Moment.duration_class.make( config )
			var moment = Moment.make().merge( this )

			var second = moment.second + duration.second
			var native = new Date(
				moment.year + duration.year ,
				moment.month + duration.month ,
				moment.day + duration.day + 1 ,
				moment.hour + duration.hour ,
				moment.minute + duration.minute ,
				Math.floor( second ) ,
				( second - Math.floor( second ) ) * 1000
			)

			if( isNaN( native.valueOf() ) ) throw new Error( 'Wrong time' )

			return new Moment({
				year : ( this._year === void 0 ) ? void 0 : native.getFullYear(),
				month : ( this._month === void 0 ) ? void 0 : native.getMonth(),
				day : ( this._day === void 0 ) ? void 0 : native.getDate() - 1,
				hour : ( this._hour === void 0 ) ? void 0 : native.getHours(),
				minute : ( this._minute === void 0 ) ? void 0 : native.getMinutes(),
				second : ( this._second === void 0 ) ? void 0 : native.getSeconds() + native.getMilliseconds() / 1000,
				offset : this.offset,
			})
		}

		sub( config : number | number[] | Date | string | moment_iconfig ) {
			var Moment = <typeof moment_class>this.constructor
			var moment = Moment.make( config )
			var dur = {
				year : ( moment.year === void 0 )
					? this.year
					: ( this.year || 0 ) - moment.year,
				month : ( moment.month === void 0 )
					? this.month
					: ( this.month || 0 ) - moment.month,
				day : ( moment.day === void 0 )
					? this.day
					: ( this.day || 0 ) - moment.day,
				hour : ( moment.hour === void 0 )
					? this.hour
					: ( this.hour || 0 ) - moment.hour,
				minute : ( moment.minute === void 0 )
					? this.minute
					: ( this.minute || 0 ) - moment.minute,
				second : ( moment.second === void 0 )
					? this.second
					: ( this.second || 0 ) - moment.second,
			}
			return new Moment.duration_class( dur )
		}

		toOffset( duration : number | number[] | string | $jin.time.duration_iconfig ) {
			if( this._offset ) {
				var Moment = <typeof moment_class>this.constructor
				return this
					.shift( Moment.duration_class.make( duration ).sub( this._offset ) )
					.merge({ offset : duration })
			} else {
				return this.merge({ offset : duration })
			}
		}

		valueOf() { return this.native.getTime() }

		toJSON() { return this.toString() }

		toString( pattern = 'YYYY-MM-DDThh:mm:ss.sssZ' ) {
			return super.toString( pattern )
		}

		// Mnemonics:
		//  * single letter for numbers: M - month number, D - day of month.
		//  * uppercase letters for dates, lowercase for times: M - month number , m - minutes number
		//  * repeated letters for define register count: YYYY - full year, YY - shot year, MM - padded month number
		//  * words for word representation: Month - month name, WeekDay - day of week name
		//  * shortcuts: WD - short day of week, Mon - short month name.
		static patterns = {
			'YYYY' : moment => {
				if( moment.year == null ) return ''
				return String( moment.year )
			} ,
			'AD' : moment => {
				if( moment.year == null ) return ''
				return String( Math.floor( moment.year / 100 ) + 1 )
			} ,
			'YY' : moment => {
				if( moment.year == null ) return ''
				return String( moment.year % 100 )
			} ,
			'Month' : moment => {
				if( moment.month == null ) return ''
				return moment.constructor.monthLong[ moment.month ]
			} ,
			'Mon' : moment => {
				if( moment.month == null ) return ''
				return moment.constructor.monthShort[ moment.month ]
			} ,
			'-MM' : moment => {
				if( moment.month == null ) return ''
				return '-' + moment.constructor.patterns[ 'MM' ]( moment )
			} ,
			'MM' : moment => {
				if( moment.month == null ) return ''
				var month = moment.month + 1
				return ( month < 10 )
					? ( '0' + month )
					: ( '' + month )
			} ,
			'M' : moment => {
				if( moment.month == null ) return ''
				return String( moment.month + 1 )
			} ,
			'WeekDay' : moment => {
				if( moment.weekDay == null ) return ''
				return moment.constructor.weekDayLong[ moment.weekDay ]
			} ,
			'WD' : moment => {
				if( moment.weekDay == null ) return ''
				return moment.constructor.weekDayShort[ moment.weekDay ]
			} ,
			'-DD' : moment => {
				if( moment.day == null ) return ''
				return '-' + moment.constructor.patterns[ 'DD' ]( moment )
			} ,
			'DD' : moment => {
				if( moment.day == null ) return ''
				var day = moment.day + 1
				return ( day < 10 )
					? ( '0' + day )
					: String( day )
			} ,
			'D' : moment => {
				if( moment.day == null ) return ''
				return String( moment.day + 1 )
			} ,
			'Thh' : moment => {
				if( moment.hour == null ) return ''
				return 'T' + moment.constructor.patterns[ 'hh' ]( moment )
			} ,
			'hh' : moment => {
				if( moment.hour == null ) return ''
				return ( moment.hour < 10 )
					? ( '0' + moment.hour )
					: String( moment.hour )
			} ,
			'h' : moment => {
				if( moment.hour == null ) return ''
				return String( moment.hour )
			} ,
			':mm' : moment => {
				if( moment.minute == null ) return ''
				return ':' + moment.constructor.patterns[ 'mm' ]( moment )
			} ,
			'mm' : moment => {
				if( moment.minute == null ) return ''
				return ( moment.minute < 10 )
					? ( '0' + moment.minute )
					: String( moment.minute )
			} ,
			'm' : moment => {
				if( moment.minute == null ) return ''
				return String( moment.minute )
			},
			':ss' : moment => {
				if( moment.second == null ) return ''
				return ':' + moment.constructor.patterns[ 'ss' ]( moment )
			},
			'ss' : moment => {
				if( moment.second == null ) return ''
				var second = Math.floor( moment.second )
				return ( second < 10 )
					? ( '0' + second )
					: String( second )
			},
			's' : moment => {
				if( moment.second == null ) return ''
				return String( Math.floor( moment.second ) )
			} ,
			'.sss' : moment => {
				if( moment.second == null ) return ''
				if( moment.second - Math.floor( moment.second ) === 0 ) return ''
				return '.' + moment.constructor.patterns[ 'sss' ]( moment )
			},
			'sss' : moment => {
				if( moment.second == null ) return ''
				var millisecond = Math.floor( ( moment.second - Math.floor( moment.second ) ) * 1000 )
				return ( millisecond < 10 )
					? ( '00' + millisecond )
					: ( millisecond < 100 )
					? ( '0' + millisecond )
					: String( millisecond )
			},
			'Z' : moment => {
				var offset = moment.offset
				if( !offset ) return ''

				return offset.toString( '+hh:mm' )
			}
		}

		static monthLong = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
		static monthShort = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
		static weekDayLong = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
		static weekDayShort = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]

	}

	export var moment : {
		[ index : string ] : typeof moment_class
		( moment? : number | number[] | Date | string | moment_iconfig ) : moment_class
	} = moment_class.make.bind( moment_class )
	moment['en'] = moment_class.make.bind( moment_class )

	export class moment_class_ru extends moment_class {
		static monthLong = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]
		static monthShort = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ]
		static weekDayLong = [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ]
		static weekDayShort = [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ]
	}
	moment['ru'] = moment_class_ru.make.bind( moment_class_ru )

}
