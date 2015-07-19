$jin.time1.format( '#Y', function( period ){
	return period.years() + 'Y'
})

$jin.time1.format( '#M', function( period ){
	return period.months() + 'M'
})

$jin.time1.format( '#D', function( period ){
	return period.days() + 'D'
})

$jin.time1.format( '#h', function( period ){
	return period.hours() + 'H'
})

$jin.time1.format( '#m', function( period ){
	return period.minutes() + 'M'
})

$jin.time1.format( '#s', function( period ){
	return period.seconds() + 'S'
})


$jin.time1.format( '# years', function( count ){
	return $jin.l10n.plural( '$jin.time1.format:years', count )
})
