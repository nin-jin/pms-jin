$jin.test( function triplets( test ){
	test.equal(
		$jin.time.range('2015-01-01/P1M').to.toString(),
		'2015-02-01'
	)
	test.equal(
		$jin.time.range('P1M/2015-02-01').from.toString(),
		'2015-01-01'
	)
	test.equal(
		$jin.time.range('2015-01-01/2015-02-01').duration.toString(),
		'PT2678400S'
	)
})
