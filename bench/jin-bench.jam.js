/**
 * @name $jin.bench
 * @method bench
 * @member $jin
 * @static
 */
$jin.method({ '$jin.bench': function( setup, sources, teardown ){
	if( !setup ) setup = ''
	if( !teardown ) teardown = ''

	var cases = sources.map( function( source ){
		source = $jin.bench.split( source )
		source.prefix = setup + source.prefix
		source.postfix = source.postfix + teardown

		return {
			source: source,
			code: {
				outer: source.prefix + source.postfix,
				inner: source.infix,
				full: source.prefix + source.infix + source.postfix
			},
			measure: {}
		}
	})

//	var measures = codes.map( function( code ){
//		return {
//			outer: $jin.bench.measure( code.outer ),
//			full: $jin.bench.measure( code.full )
//		}
//	} )

	var count = 1
	while( true ){

		var totalTime = cases.reduce( function( time, kase ){
			kase.code.outer = kase.code.outer + kase.code.outer
			kase.code.inner = kase.code.inner + kase.code.inner.replace( /(\d+)(\/\*num\*\/)/g, function( str, numb, suffix ){
				return ( Number( numb ) + count )  + suffix
			} )
			
			kase.measure.outer = $jin.bench.measure( kase.code.outer )
			kase.measure.full = $jin.bench.measure( kase.source.prefix + kase.code.inner + kase.source.postfix )
			
			return time + kase.measure.outer.compile + kase.measure.outer.execute + kase.measure.full.compile + kase.measure.full.execute
		}, 0 )
		
		count *= 2
		
		if(!( totalTime < 1000000 )) break
		if(!( count < 1000000 )) break
	}

	return cases.map( function( kase ){
		return {
			outer: {
				code: kase.source.prefix + kase.source.postfix,
				compile: kase.measure.outer.compile / count,
				execute: kase.measure.outer.execute / count,
				error: kase.measure.outer.error
			},
			inner: {
				code: kase.source.infix,
				compile: ( kase.measure.full.compile - kase.measure.outer.compile / count ) / count,
				execute: ( kase.measure.full.execute - kase.measure.outer.execute / count ) / count,
				error: kase.measure.full.error
			}
		}
	} )

} })

/**
 * @name $jin.bench.split
 * @method split
 * @member $jin.bench
 * @static
 */
$jin.method({ '$jin.bench.split': function( source ){

	var matches = /^(?:([\s\S]*?)\/\*in\*\/)?([\s\S]*?)(?:\/\*out\*\/([\s\S]*))?$/.exec( source )
	if( !matches ) throw new Error( 'Can not split js source to prefix/*in*/infix/*out*/+postfix' )

	return {
		prefix: matches[1] || '\n',
		infix: matches[2],
		postfix: matches[3] || '\n'
	}
}})

/**
 * @name $jin.bench.measure
 * @method measure
 * @member $jin.bench
 * @static
 */
$jin.method({ '$jin.bench.measure': $jin.thread( function( proc ){
	var time = window.perfromance || window.Date
	
	if( typeof proc === 'string' ){
		try {
			var startCompile = time.now()
				proc = new Function( '', proc )
			var endCompile = time.now()
		} catch( error ){
			return { error: error }
		}
	}

	try {
		var startExec = time.now()
			proc()
		var endExec= time.now()
	} catch( error ){
		return { error: error }
	}

	return {
		compile: 1000 * ( endCompile - startCompile ),
		execute: 1000 * ( endExec - startExec )
	}

}) })

/**
 * @name $jin.bench.log
 * @method log
 * @member $jin.bench
 * @static
 */
$jin.method({ '$jin.bench.log': function( setup, codes, teardown ){
	var measures = $jin.bench( setup, codes, teardown )
	
	measures.forEach( function( measure, i ){
		console.table( measure )
	})

	return measures
}})
