$mol_test( function parse_n_serial( test ){
	test.equal( $jin.time.moment( '2014' ).toString(), '2014' )
	test.equal( $jin.time.moment( '2014-01' ).toString(), '2014-01' )
	test.equal( $jin.time.moment( '2014-01-02' ).toString(), '2014-01-02' )
	test.equal( $jin.time.moment( '2014-01-02T03' ).toString(), '2014-01-02T03' )
	test.equal( $jin.time.moment( '2014-01-02T03:04' ).toString(), '2014-01-02T03:04' )
	test.equal( $jin.time.moment( '2014-01-02T03:04:05' ).toString(), '2014-01-02T03:04:05' )
	test.equal( $jin.time.moment( '2014-01-02T03:04:05.006' ).toString(), '2014-01-02T03:04:05.006' )
	test.equal( $jin.time.moment( '2014-01-02T03:04:05.006Z' ).toString(), '2014-01-02T03:04:05.006+00:00' )
	test.equal( $jin.time.moment( '2014-01-02T03:04:05.006+07:00' ).toString(), '2014-01-02T03:04:05.006+07:00' )
	test.equal( $jin.time.moment( '2014-01-02T03:04:05+07:08' ).toString(), '2014-01-02T03:04:05+07:08' )
	test.equal( $jin.time.moment( '2014-01-02T03:04+07:08' ).toString(), '2014-01-02T03:04+07:08' )
	test.equal( $jin.time.moment( 'T03:04+07:08' ).toString(), 'T03:04+07:08' )
	test.equal( $jin.time.moment( 'T03:04:05' ).toString(), 'T03:04:05' )
	test.equal( $jin.time.moment( 'T03:04' ).toString(), 'T03:04' )
	test.equal( $jin.time.moment( 'T03' ).toString(), 'T03' )
})

$mol_test( function format_simple( test ){
	test.equal(
		$jin.time.moment( '2014-01-02T01:02:03.000' ).toString( 'AD YY-M-D h:m:s' ) ,
		'21 14-1-2 1:2:3'
	)
} )

$mol_test( function format_padded( test ){
	test.equal(
		$jin.time.moment( '2014-01-02T01:02:03.000' ).toString( 'YYYY-MM-DD hh:mm:ss' ) ,
		'2014-01-02 01:02:03'
	)
} )

$mol_test( function format_time_zone( test ){
	test.equal(
		$jin.time.moment( '2014-01-02T01:02:03+05:00' ).toString( 'Z' ) ,
		'+05:00'
	)
} )

$mol_test( function format_names( test ){
	test.equal(
		$jin.time.moment( '2014-01-02T01:02:03.000' ).toString( 'Month Mon | WeekDay WD' ) ,
		'January Jan | Thursday Thu'
	)
} )

$mol_test( function shifting( test ){
	test.equal( $jin.time.moment( 'T15:54:58.243+03:00' ).shift({}).toString() , 'T15:54:58.243+03:00' )
	test.equal( $jin.time.moment( '2014-01-02' ).shift( 'P1Y' ).toString(), '2015-01-02' )
	test.equal( $jin.time.moment( '2014-01-02' ).shift( 'P12M' ).toString(), '2015-01-02' )
	test.equal( $jin.time.moment( '2014-01-02' ).shift( 'P365D' ).toString(), '2015-01-02' )
	test.equal( $jin.time.moment( '2014-01-02' ).shift( 'PT8760h' ).toString(), '2015-01-02' )
	test.equal( $jin.time.moment( '2014-01' ).shift( 'PT8760h' ).toString(), '2015-01' )
	test.equal( $jin.time.moment( '2014-01' ).shift( 'PT-8760h' ).toString(), '2013-01' )
} )

$mol_test( function normalization( test ) {
	test.equal(
		$jin.time.moment( '2015-07-35' ).normal.toString(),
		'2015-08-04'
	)
})
