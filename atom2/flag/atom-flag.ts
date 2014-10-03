module $jin.atom2 {
    
    export class flag<OwnerType extends $jin.object> extends $jin.atom2.transit<boolean,OwnerType> {
        
        toggle( ) {
            this.set( !this.get() )
        }
        
    }
    
}