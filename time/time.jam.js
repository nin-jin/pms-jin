/**
 * @name $jin.time
 * @method time
 * @member $jin
 * @static
 */
$jin.method({ '$jin.time': function( time ){
	switch( $jin.type( time ) ){
		case 'Number':
			time = new Date( time )
		case 'Date':
			return $jin.time.moment({ date: time })
		case 'String':
			if( time[0] === 'P' ){
				return $jin.time.period()
			} else {
				var parsed = /^(?:(\d\d\d\d)(?:-?(\d\d)(?:-?(\d\d))?)?)?(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d\d\d))?)?)?(Z|[\+\-](\d\d)(?::?(\d\d)?)?)?)?$/.exec( time )
				if( !parsed ) throw new Error( 'Can not parse time (' + time + ')' )
				
				return $jin.time.moment( {
					year: parsed[1],
					month: parsed[2] && ( parsed[2] - 1 ),
					day: parsed[3] && ( parsed[3] - 1 ),
					hour: parsed[4],
					minute: parsed[5],
					second: parsed[6],
					millisecond: parsed[7],
					offset: parsed[8]
				})
			}
		default:
			throw new Error( 'Wrong type of time (' + $jin.type( time ) + ')' )
	}
}})