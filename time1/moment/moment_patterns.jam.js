$jin.time1.format( 'Month', function( time ){
	var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
	return $jin.l10n( '$jin.time1.format:Month', months[ time.month() ] )
})
$jin.time1.format( 'month', $jin.pipe([
    $jin.time1.format( 'Month' ),
    $jin.ensure.string.lowerCase()
]) )

$jin.time1.format( 'Mon', function( time ){
	var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
	return $jin.l10n( '$jin.time1.format:Mon', months[ time.month() ] )
})
$jin.time1.format( 'mon', $jin.pipe([
    $jin.time1.format( 'Mon' ),
    $jin.ensure.string.lowerCase()
]) )

$jin.time1.format( 'Weekday', function( time ){
	var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
	return $jin.l10n( '$jin.time1.format:Weekday', days[ time.weekDay() ] )
})
$jin.time1.format( 'weekday', $jin.pipe([
    $jin.time1.format( 'Weekday' ),
    $jin.ensure.string.lowerCase()
]) )

$jin.time1.format( 'WD', function( time ){
	var days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
	return $jin.l10n( '$jin.time1.format:WD', days[ time.weekDay() ] )
})
$jin.time1.format( 'wd', $jin.pipe([
    $jin.time1.format( 'WD' ),
    $jin.ensure.string.lowerCase()
]) )

$jin.time1.format( 'YYYY', $jin.pipe([
	function( time ) {
		return time.year()
	},
    String
]))
$jin.time1.format( 'AD', $jin.pipe([
	function( time ) {
		return Math.ceil( time.year() / 100 )
	},
    String
]))
$jin.time1.format( 'YY', $jin.pipe([
	function( time ) {
		return time.year() % 100
	},
    String
]))

$jin.time1.format( 'M', $jin.pipe([
	function( time ) {
		return time.month() + 1
	},
    String
]))
$jin.time1.format( 'MM', $jin.pipe([
    $jin.time1.format( 'M' ),
    $jin.ensure.string.paddedLeft( 2, '0' )
]) )

$jin.time1.format( 'D', $jin.pipe([
	function( time ) {
		return time.day() + 1
	},
]))
$jin.time1.format( 'DD', $jin.pipe([
    $jin.time1.format( 'D' ),
    $jin.ensure.string.paddedLeft( 2, '0' )
]) )

$jin.time1.format( 'h', $jin.pipe([
	function( time ) {
		return time.hour()
	},
    String
]))
$jin.time1.format( 'hh', $jin.pipe([
    $jin.time1.format( 'h' ),
    $jin.ensure.string.paddedLeft( 2, '0' )
]) )

$jin.time1.format( 'm', $jin.pipe([
	function( time ) {
		return time.minute()
	},
    String
]))
$jin.time1.format( 'mm', $jin.pipe([
    $jin.time1.format( 'm' ),
    $jin.ensure.string.paddedLeft( 2, '0' )
]) )

$jin.time1.format( 's', $jin.pipe([
	function( time ){
		return time.second()
	},
    String
]))
$jin.time1.format( 'ss', $jin.pipe([
    $jin.time1.format( 's' ),
    $jin.ensure.string.paddedLeft( 2, '0' )
]) )
$jin.time1.format( 'sss', $jin.pipe([
	function( time ){
		return time.millisecond()
	},
	$jin.ensure.string.paddedLeft( 3, '0' )
]))

$jin.time1.format( 'ZZ', function( time ){
	var offset = time.offset()
	if( !offset ) return ''

	var hours = offset.hours()
	var minutes = offset.minutes()

	if(( hours == 0 )&&( minutes == 0 )) return 'Z'

	if( hours < 0 ){
		var sign = '-'
		hours = -hours
		minutes = -minutes
	} else {
		var sign = '+'
	}

	var pad2 = $jin.ensure.string.paddedLeft( 2, '0' )

	return sign + pad2( hours ) + ':' + pad2( minutes )
})

