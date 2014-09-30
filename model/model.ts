module $jin {
    
    export class model extends $jin.object {

        static objectPath = '$jin.model'
        
        static classRegister( classId : string ) {
            $jin.model.classAtom( classId ).notify()
            return classId
        }

        static classAtom( key : string ){
            return new $jin.atom2.transit<string>( {
                owner : $jin.model,
                name : key
            } )
        }
        
        constructor() {
            super()
            $jin.model.classAtom( this['constructor']['objectPath'] ).touch()
        }
        
        destroy() {
        }
    }
    
    module model {

    }
}