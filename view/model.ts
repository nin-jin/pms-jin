module $jin.view {
    
    export class model < OwnerType extends $jin.object.iface > extends $jin.model < OwnerType > {
        static objectId = $jin.model.classRegister( '$jin.view.model' , '$jin.model' )
        // content : $jin.atom.prop< any[] , $jin.view.model >

        element( name , param ) {
            return new $jin.view[ this.constructor['objectId'] + '_' + name ]({
                owner: this,
                view: this,
                name: name,
                param: param
            })
        }

    }
    
}
