module $jin.time {

	export interface range_iconfig {
		from? : number | number[] | Date | string | $jin.time.moment_iconfig
		to? : number | number[] | Date | string | $jin.time.moment_iconfig
		duration? : number | number[] | string | $jin.time.duration_iconfig
	}

	export class range_class extends $jin.time.base_class {

		static Moment = $jin.time.moment_class
		static Duration = $jin.time.duration_class

		static make( range : string | string[] | number[] | Date[] | $jin.time.moment_iconfig[] | range_iconfig ) {

			var type = $jin_type( range )
			switch( type ){

				case 'String':
					var chunks = (<string>range).split( '/' )
					var config = {}
					config[ /^P/i.test( chunks[0] ) ? 'duration' : 'from' ] = chunks[0]
					config[ /^P/i.test( chunks[1] ) ? 'duration' : 'to' ] = chunks[1]
					return this.make( config )

				case 'Array':
					return new this({
						from : range[0] ,
						to : range[1] ,
						duration : range[2] ,
					})

				case 'Object':
					if( range instanceof this ) return range;
					return new (<typeof range_class>this)( <range_iconfig>range )

				default:
					throw new Error( 'Wrong type of time range (' + type + ')' )
			}

		}

		_from : $jin.time.moment_class
		get from() {
			if( this._from ) return this._from
			var Range = <typeof range_class>this.constructor
			return this._from = this._to.shift( Range.Duration.make().sub( this._duration ) )
		}

		_to : $jin.time.moment_class
		get to() {
			if( this._to ) return this._to
			return this._to = this._from.shift( this._duration )
		}

		_duration : $jin.time.duration_class
		get duration() {
			if( this._duration ) return this._duration
			var Range = <typeof range_class>this.constructor
			return this._duration = Range.Duration.make( this._to.valueOf() - this.from.valueOf() )
		}

		constructor( config : range_iconfig ) {
			super()
			var Range = <typeof range_class>this.constructor
			this._from = config.from && Range.Moment.make( config.from )
			this._to = config.to && Range.Moment.make( config.to )
			this._duration = config.duration && Range.Duration.make( config.duration )
		}

		toJSON() { return this.toString() }

		toString( ) {
			return ( this._from || this._duration ).toString() + '/' + ( this._to || this._duration ).toString()
		}

	}

	export var range = range_class.make.bind( range_class )

}
