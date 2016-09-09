module $jin.time {

	export class base_class {

		static patterns : any = {}

		static formatter( pattern : string ) {
			if( this.patterns[ pattern ] ) return this.patterns[ pattern ]

			var tokens = Object.keys( this.patterns )
				.sort()
				.reverse()
				.map( ( token : string ) => token.replace( /([-+*.\[\]()\^])/g , '\\$1' ) )
			var lexer = RegExp( '(.*?)(' + tokens.join( '|' ) + '|$)', 'g' )

			var funcs : any[] = []

			pattern.replace( lexer, ( str : string , text : string , token : string ) => {
				if( text ) funcs.push( () => text )
				if( token ) funcs.push( this.patterns[ token ] )
				return str
			})

			return this.patterns[ pattern ] = $jin.concater( funcs )
		}

		toString( pattern : string ) {
			var Base = <typeof base_class>this.constructor
			var formatter = Base.formatter( pattern )
			return formatter.call( Base , this )
		}

	}

}
