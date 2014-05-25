$jin.test( function simple( test ){
	var formatTime = $jin.time.format( 'AD YY-M-D h:m:s' )
	var time = $jin.time( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, '21 14-1-2 1:2:3' )
} )

$jin.test( function padded( test ){
	var formatTime = $jin.time.format( 'YYYY-MM-DD hh:mm:ss' )
	var time = $jin.time( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, '2014-01-02 01:02:03' )
} )

//$jin.test( function zone( test ){
//	var formatTime = $jin.time.format( 'zone' )
//	var time = $jin.time( '2014-01-02T01:02:03' )
//	var str = formatTime( time )
//	test.equal( str, '' )
//} )

$jin.test( function names( test ){
	var formatTime = $jin.time.format( 'Month Mon | Weekday WD' )
	var time = $jin.time( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, 'January Jan | Thursday Thu' )
} )

$jin.test( function lower_names( test ){
	var formatTime = $jin.time.format( 'month mon | weekday wd' )
	var time = $jin.time( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, 'january jan | thursday thu' )
} )
