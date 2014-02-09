$jin.atom.prop({ '$jin.date.today':
{	put: function( val ){
		if( val instanceof Date ) return val

		return new Date( val )
	},
	pull: function( ){
		var now = new Date

		var nowMS = ( ( ( now.getHours() * 60 ) + now.getMinutes() ) * 60 + now.getSeconds() ) * 1000
		var dailyMS = 24 * 60 * 60 * 1000
		var delay = dailyMS - nowMS

		$jin.schedule( delay, function( ){
			$jin.date.todayAtom().pull()
		} )

		return now
	}

}})
