module $jin.atom2 {
    
    export class numb<OwnerType extends $jin.object> extends $jin.atom2.transit<number,OwnerType> {
        
        increment( value ) {
            this.set( this.get() + value )
        }

        decrement( value ) {
            this.set( this.get() - value )
        }

        multiply( value ) {
            this.set( this.get() * value )
        }

        divide( value ) {
            this.set( this.get() / value )
        }

    }
    
}