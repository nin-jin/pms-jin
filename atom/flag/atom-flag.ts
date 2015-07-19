module $jin.atom {
    
    export class flag extends $jin.atom.prop<boolean> {
        
        toggle( ) {
            this.set( !this.get() )
        }
        
    }
    
}