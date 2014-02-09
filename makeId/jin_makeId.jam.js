$jin.makeId = function( prefix ){
	var seed = $jin.makeId.seeds[ prefix ] || 0
	$jin.makeId.seeds[ prefix ] = seed + 1
    return prefix + ':' + seed
}

$jin.makeId.seeds = {}
