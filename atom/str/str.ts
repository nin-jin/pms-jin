module $jin.atom {
    
    export class str extends $jin.atom.prop < string > {
        
        append( value ) {
            this.set( this.get() + value )
        }

        prepend( value ) {
            this.set( value + this.get() )
        }

        replace( regexp : RegExp , handler : ( ...found : string[] ) => string  ) {
            this.set( this.get().replace( regexp , handler ) )
        }

    }
    
}