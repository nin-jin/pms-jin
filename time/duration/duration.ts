module $jin.time {

	export interface duration_iconfig {
		year? : number | string
		month? : number | string
		day? : number | string
		hour? : number | string
		minute? : number | string
		second? : number | string
	}

	export class duration_class extends $jin.time.base_class {

		static make( duration? : number | number[] | string | duration_iconfig ) {
			if( !arguments.length ) duration = []

			var type = $jin_type( duration )
			switch( type ){

				case 'Number':
					return new this({ second : <number>duration / 1000 })

				case 'Array':
					return new this({
						year : duration[0] ,
						month : duration[1] ,
						day : duration[2] ,
						hour : duration[3] ,
						minute : duration[4] ,
						second : duration[5] ,
					})

				case 'Object':
					if( duration instanceof this ) return duration;
					return new this( <duration_iconfig>duration )

				case 'String':
					if( duration === 'Z' ) {
						return new this({})
					}

					var parser = /^P(?:([+-]?\d+(?:\.\d+)?)Y)?(?:([+-]?\d+(?:\.\d+)?)M)?(?:([+-]?\d+(?:\.\d+)?)D)?(?:T(?:([+-]?\d+(?:\.\d+)?)h)?(?:([+-]?\d+(?:\.\d+)?)m)?(?:([+-]?\d+(?:\.\d+)?)s)?)?$/i
					var found = parser.exec( <string>duration )
					if( found ){
						return new this({
							year : found[1] ,
							month : found[2] ,
							day : found[3] ,
							hour : found[4] ,
							minute : found[5] ,
							second : found[6] ,
						})
					}

					var parser = /^[+-](\d\d)(?::?(\d\d))?$/i
					var found = parser.exec( <string>duration )
					if( found ){
						return new this({
							hour : found[1] ,
							minute : found[2] ,
						})
					}

					throw new Error( 'Can not parse time duration (' + duration + ')' )

				default:
					throw new Error( 'Wrong type of time duration (' + type + ')' )
			}
		}

		_year : number
		get year() { return this._year }

		_month : number
		get month() { return this._month }

		_day : number
		get day() { return this._day }

		_hour : number
		get hour() { return this._hour }

		_minute : number
		get minute() { return this._minute }

		_second : number
		get second() { return this._second }


		constructor( config : duration_iconfig ) {
			super()
			this._year = config.year && Number( config.year ) || 0
			this._month = config.month && Number( config.month ) || 0
			this._day = config.day && Number( config.day ) || 0
			this._hour = config.hour && Number( config.hour ) || 0
			this._minute = config.minute && Number( config.minute ) || 0
			this._second = config.second && Number( config.second ) || 0
		}

		summ( config : number | number[] | string | duration_iconfig ) {
			var Duration = <typeof duration_class>this.constructor
			var duration = Duration.make( config )
			return new Duration({
				year : this.year + duration.year,
				month : this.month + duration.month,
				day : this.day + duration.day,
				hour : this.hour + duration.hour,
				minute : this.minute + duration.minute,
				second : this.second + duration.second,
			})
		}

		sub( config : number | number[] | string | duration_iconfig ) {
			var Duration = <typeof duration_class>this.constructor
			var duration = Duration.make( config )
			return new Duration({
				year : this.year - duration.year,
				month : this.month - duration.month,
				day : this.day - duration.day,
				hour : this.hour - duration.hour,
				minute : this.minute - duration.minute,
				second : this.second - duration.second,
			})
		}

		valueOf() {
			var day = this.year * 365 + this.month * 30.4 + this.day
			var second = ( ( day * 24 + this.hour ) * 60 + this.minute ) * 60 + this.second
			return second * 1000
		}

		toJSON() { return this.toString() }

		toString( pattern = 'P#Y#M#DT#h#m#s' ) {
			return super.toString( pattern )
		}

		static patterns = {
			'#Y' : duration => {
				if( !duration.year ) return ''
				return duration.year + 'Y'
			} ,
			'#M' : duration => {
				if( !duration.month ) return ''
				return duration.month + 'M'
			} ,
			'#D' : duration => {
				if( !duration.day ) return ''
				return duration.day + 'D'
			} ,
			'#h' : duration => {
				if( !duration.hour ) return ''
				return duration.hour + 'H'
			} ,
			'#m' : duration => {
				if( !duration.minute ) return ''
				return duration.minute + 'M'
			} ,
			'#s' : duration => {
				if( !duration.second ) return ''
				return duration.second + 'S'
			} ,
			'+hh' : duration => {
				var hour = duration.hour
				var sign = '+'
				if( hour < 0 ) {
					sign = '-'
					hour = -hour
				}
				return ( hour < 10 )
						? ( sign + '0' + hour )
						: ( sign + hour )
			} ,
			'mm' : duration => {
				return ( duration.minute < 10 )
					? ( '0' + duration.minute )
					: String( duration.minute )
			} ,
		}

	}

	export var duration = duration_class.make.bind( duration_class )

}
