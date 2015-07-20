module $jin.time {

	export interface range_iconfig {
		start? : number | number[] | Date | string | $jin.time.moment_iconfig
		end? : number | number[] | Date | string | $jin.time.moment_iconfig
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
					if( chunks[0] ) {
						config[ /^P/i.test( chunks[ 0 ] ) ? 'duration' : 'start' ] = chunks[ 0 ]
					} else {
						config['start'] = $jin.time.moment()
					}
					if( chunks[1] ) {
						config[ /^P/i.test( chunks[ 1 ] ) ? 'duration' : 'end' ] = chunks[ 1 ]
					} else {
						config['end'] = $jin.time.moment()
					}
					return this.make( config )

				case 'Array':
					return new this({
						start : range[0] ,
						end : range[1] ,
						duration : range[2] ,
					})

				case 'Object':
					if( range instanceof this ) return range;
					return new (<typeof range_class>this)( <range_iconfig>range )

				default:
					throw new Error( 'Wrong type of time range (' + type + ')' )
			}

		}

		_start : $jin.time.moment_class
		get start() {
			if( this._start ) return this._start
			var Range = <typeof range_class>this.constructor
			return this._start = this._end.shift( Range.Duration.make().sub( this._duration ) )
		}

		_end : $jin.time.moment_class
		get end() {
			if( this._end ) return this._end
			return this._end = this._start.shift( this._duration )
		}

		_duration : $jin.time.duration_class
		get duration() {
			if( this._duration ) return this._duration
			var Range = <typeof range_class>this.constructor
			return this._duration = Range.Duration.make( this._end.valueOf() - this.start.valueOf() )
		}

		constructor( config : range_iconfig ) {
			super()
			var Range = <typeof range_class>this.constructor
			this._start = config.start && Range.Moment.make( config.start )
			this._end = config.end && Range.Moment.make( config.end )
			this._duration = config.duration && Range.Duration.make( config.duration )
		}

		toJSON() { return this.toString() }

		toString( ) {
			return ( this._start || this._duration ).toString() + '/' + ( this._end || this._duration ).toString()
		}

	}

	export var range = range_class.make.bind( range_class )

}
