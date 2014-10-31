module $jin.atom {
    
    export class numb < OwnerType extends $jin.object > extends $jin.atom.prop < number , OwnerType > {
        
        summ( value ) {
            this.set( this.get() + value )
        }

        multiply( value ) {
            this.set( this.get() * value )
        }

    }
    
}