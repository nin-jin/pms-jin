$jin.test( function parse_n_serial( test ){
	test.equal( $jin.time.duration( 'P42.1Y' ).toString(), 'P42.1YT' )
	test.equal( $jin.time.duration( 'P42.1M' ).toString(), 'P42.1MT' )
	test.equal( $jin.time.duration( 'P42.1D' ).toString(), 'P42.1DT' )
	test.equal( $jin.time.duration( 'PT42.1h' ).toString(), 'PT42.1H' )
	test.equal( $jin.time.duration( 'PT42.1m' ).toString(), 'PT42.1M' )
	test.equal( $jin.time.duration( 'PT42.1s' ).toString(), 'PT42.1S' )
	test.equal( $jin.time.duration( 'P1Y2M3DT4h5m6.7s' ).toString(), 'P1Y2M3DT4H5M6.7S' )
})

$jin.test( function format_typed( test ){
	test.equal(
		$jin.time.duration( 'P1Y2M3DT4h5m6s' ).toString( 'P#Y#M#DT#h#m#s' ) ,
		'P1Y2M3DT4H5M6S'
	)
} )