module $jin.atom {
    
    export class flag<OwnerType extends $jin.object> extends $jin.atom.prop<boolean,OwnerType> {
        
        toggle( ) {
            this.set( !this.get() )
        }
        
    }
    
}