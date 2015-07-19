module $jin.atom {
    
    export class numb extends $jin.atom.prop < number > {
        
        summ( value ) {
            this.set( this.get() + value )
        }

        multiply( value ) {
            this.set( this.get() * value )
        }

    }
    
}