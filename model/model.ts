module $jin {
    
    export class model < OwnerType extends $jin.object.iface > extends $jin.object < OwnerType > {

        static objectId = '$jin.model'

        static classRegister( classId : string , superId? : string ) {
            var classAtom = $jin.model.classAtom( classId )
            classAtom.notify()
            if( superId ) {
                var superAtom = $jin.model.classAtom(superId)
                classAtom.obey(superAtom)
                superAtom.lead(classAtom)
            }
            return classId
        }

        static classAtom( key : string ){
            return new $jin.atom.prop<string,typeof $jin.model>( {
                owner : $jin.model,
                name : key
            } )
        }

        constructor( config ) {
            super( config )
            $jin.model.classAtom( (<any>this.constructor).objectId ).touch()
        }

        toString() {
            return this.objectId
        }

    }
    
    module model {

    }
}