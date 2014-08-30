$jin.time.format( 'Month', function( time ){
	var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
	return $jin.l10n( '$jin.time.format:Month', months[ time.month() ] )
})
$jin.time.format( 'month', $jin.pipe([ $jin.time.format( 'Month' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'Mon', function( time ){
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
	return $jin.l10n( '$jin.time.format:Mon', months[ time.month() ] )
})
$jin.time.format( 'mon', $jin.pipe([ $jin.time.format( 'Mon' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'Weekday', function( time ){
	var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
	return $jin.l10n( '$jin.time.format:Weekday', days[ time.weekDay() ] )
})
$jin.time.format( 'weekday', $jin.pipe([ $jin.time.format( 'Weekday' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'WD', function( time ){
	var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
	return $jin.l10n( '$jin.time.format:WD', days[ time.weekDay() ] )
})
$jin.time.format( 'wd', $jin.pipe([ $jin.time.format( 'WD' ), $jin.ensure.string.lowerCase() ]) )

$jin.time.format( 'YYYY', function( time ){
	return String( time.year() )
})
$jin.time.format( 'AD', function( time ){
	return Math.ceil( time.year() / 100 )
})
$jin.time.format( 'YY', function( time ){
	return String( time.year() % 100 )
})

$jin.time.format( 'M', function( time ){
	return String( time.month() + 1 )
})
$jin.time.format( 'MM', $jin.pipe([ $jin.time.format( 'M' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'D', function( time ){
	return String( time.day() + 1 )
})
$jin.time.format( 'DD', $jin.pipe([ $jin.time.format( 'D' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'h', function( time ){
	return String( time.hour() )
})
$jin.time.format( 'hh', $jin.pipe([ $jin.time.format( 'h' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 'm', function( time ){
	return String( time.minute() )
})
$jin.time.format( 'mm', $jin.pipe([ $jin.time.format( 'm' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )

$jin.time.format( 's', function( time ){
	return String( time.second() )
})
$jin.time.format( 'ss', $jin.pipe([ $jin.time.format( 's' ), $jin.ensure.string.paddedLeft( 2, '0' ) ]) )
$jin.time.format( 'sss', $jin.pipe([
	function( time ){
		return String( time.millisecond() )
	},
	$jin.ensure.string.paddedLeft( 3, '0' )
]))

$jin.time.format( 'zone', function( time ){
	var pad2 = $jin.ensure.string.paddedLeft( 2, '0' )
	var offset = time.offset()
	if( offset < 0 ){
		var sign = '+'
		offset = -offset
	} else {
		var sign = '-'
	}
	return sign + pad2( Math.floor( offset / 60 ) ) + ':' + pad2( offset % 60 )
})

