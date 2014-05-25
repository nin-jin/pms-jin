/**
 * Generator of date-formatters.
 * Date-formatter is a function that returns string representation of a date.
 *
 * 0 params: hash-table of all patterns
 * 1 param: return date-formatter by pattern
 * 2 params: assign date-formatter for pattern
 *
 * Mnemonics:
 *
 *  * single letter for numbers: M - month number, D - day of month.
 *  * uppercase letters for dates, lowercase for times: M - month number , m - minutes number
 *  * repeated letters for define register count: YYYY - full year, YY - shot year, MM - padded month number
 *  * words, same letter case: Month - localized capitalized month name
 *  * shortcuts: WD - short day of week, Mon - short month name.
 *  * special identifiers: iso8601, stamp.
 *
 * Complex patterns splits by words and then substitute by date-formatters for short patterns
 * For localize output override $jin.l10n( scope, text )
 *
 * Typical usage:
 *     var formatTime = $jin.time.format( 'Weekday, YYYY-MM-DD hh:mm' )
 *     formatTime( $jin.time() )
 *
 * @name $jin.time.format
 * @method format
 * @member $jin.time
 * @param {string} [pattern]
 * @param {function( $jin.date )} [formatter]
 * @static
 */
$jin.property.hash({ '$jin.time.format': { pull: function( pattern ) {

	var lexems = $jin.time.format()
	var patterns = Object.keys( lexems )
	patterns.sort()
	patterns.reverse()

	var funcs = []

	var lexer = RegExp( '(.*?)(' + patterns.join( '|' ) + '|$)', 'g' )
	pattern.replace( lexer, function( str, text, token ){
		if( text ) funcs.push( text )
		if( token ) funcs.push( lexems[ token ] )
	})

	return $jin.concater( funcs )
}}})

