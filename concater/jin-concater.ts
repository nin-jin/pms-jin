module $jin {
	export function concater( funcs : ( string | { ( val? : any ) : string } )[] ) : ( val? : any ) => string {
		switch( funcs.length ) {
			case 0:
				return value => value
			case 1:
				return <{ ( val? : any ) : string }>funcs[ 0 ]
			default:
				var mid = Math.ceil( funcs.length / 2 )
				var first = $jin.concater( funcs.slice( 0 , mid ) )
				var second = $jin.concater( funcs.slice( mid ) )
				return function( value ){
					return first( value ) + second( value )
				}
		}
	}
}
