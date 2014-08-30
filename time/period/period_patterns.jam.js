$jin.time.format( '#Y', function( period ){
	return period.years() + 'Y'
})

$jin.time.format( '#M', function( period ){
	return period.months() + 'M'
})

$jin.time.format( '#D', function( period ){
	return period.days() + 'D'
})

$jin.time.format( '#h', function( period ){
	return period.hours() + 'h'
})

$jin.time.format( '#m', function( period ){
	return period.minutes() + 'm'
})

$jin.time.format( '#s', function( period ){
	return period.seconds() + 's'
})


$jin.time.format( '# years', function( count ){
	return $jin.l10n.plural( '$jin.time.format:years', count )
})
