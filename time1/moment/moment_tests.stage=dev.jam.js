$jin.test( function parse_n_serial( test ){
	test.equal( $jin.time1.moment( '2014' ).toString(), '2014' )
	test.equal( $jin.time1.moment( '2014-01' ).toString(), '2014-01' )
	test.equal( $jin.time1.moment( '2014-01-02' ).toString(), '2014-01-02' )
	test.equal( $jin.time1.moment( '2014-01-02T03' ).toString(), '2014-01-02T03' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04' ).toString(), '2014-01-02T03:04' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04:05' ).toString(), '2014-01-02T03:04:05' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04:05.006' ).toString(), '2014-01-02T03:04:05.006' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04:05.006Z' ).toString(), '2014-01-02T03:04:05.006Z' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04:05.006+07:00' ).toString(), '2014-01-02T03:04:05.006+07:00' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04:05+07:08' ).toString(), '2014-01-02T03:04:05+07:08' )
	test.equal( $jin.time1.moment( '2014-01-02T03:04+07:08' ).toString(), '2014-01-02T03:04+07:08' )
	test.equal( $jin.time1.moment( 'T03:04+07:08' ).toString(), 'T03:04+07:08' )
	test.equal( $jin.time1.moment( 'T03:04:05' ).toString(), 'T03:04:05' )
	test.equal( $jin.time1.moment( 'T03:04' ).toString(), 'T03:04' )
	test.equal( $jin.time1.moment( 'T03' ).toString(), 'T03' )
})

$jin.test( function format_simple( test ){
	var formatTime = $jin.time1.format( 'AD YY-M-D h:m:s' )
	var time = $jin.time1.moment( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, '21 14-1-2 1:2:3' )
} )

$jin.test( function format_padded( test ){
	var formatTime = $jin.time1.format( 'YYYY-MM-DD hh:mm:ss' )
	var time = $jin.time1.moment( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, '2014-01-02 01:02:03' )
} )

$jin.test( function format_time_zone( test ){
	var formatTime = $jin.time1.format( 'ZZ' )
	var time = $jin.time1.moment( '2014-01-02T01:02:03+05:00' )
	var str = formatTime( time )
	test.equal( str, '+05:00' )
} )

$jin.test( function format_names( test ){
	var formatTime = $jin.time1.format( 'Month Mon | Weekday WD' )
	var time = $jin.time1.moment( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, 'January Jan | Thursday Thu' )
} )

$jin.test( function format_lower_names( test ){
	var formatTime = $jin.time1.format( 'month mon | weekday wd' )
	var time = $jin.time1.moment( '2014-01-02T01:02:03.000' )
	var str = formatTime( time )
	test.equal( str, 'january jan | thursday thu' )
} )

$jin.test( function shifting( test ){
	test.equal( $jin.time1.moment( '2014-01-02' ).shift( 'P1Y' ).toString(), '2015-01-02' )
	test.equal( $jin.time1.moment( '2014-01-02' ).shift( 'P12M' ).toString(), '2015-01-02' )
	test.equal( $jin.time1.moment( '2014-01-02' ).shift( 'P365D' ).toString(), '2015-01-02' )
	test.equal( $jin.time1.moment( '2014-01-02' ).shift( 'PT8760h' ).toString(), '2015-01-02T00' )
	test.equal( $jin.time1.moment( '2014-01' ).shift( 'PT8760h' ).toString(), '2015-01T00' )
	test.equal( $jin.time1.moment( '2014-01' ).shift( 'PT-8760h' ).toString(), '2013-01T00' )
} )
