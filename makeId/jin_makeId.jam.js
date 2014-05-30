$jin.makeId = function( prefix ){
	var seeds = $jin.makeId.seeds 
    return seeds[ prefix ] = ( seeds[ prefix ] + 1 ) || 1
}

$jin.makeId.seeds = {}
