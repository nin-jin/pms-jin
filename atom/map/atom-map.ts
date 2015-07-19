module $jin.atom {

    export interface hashMap < ValueType > {
        [ index : number ] : ValueType;
        [ index : string ] : ValueType;
    }

    export class map < ValueType , OwnerType extends $jin.object.iface >
    extends $jin.atom.prop < hashMap < ValueType > , OwnerType > {
        
        patch( patch : hashMap < ValueType > ) {
            var next : hashMap < ValueType > = {}
            var prev = this.get()

            if( prev ) {
                for (var key in prev) {
                    if (!prev.hasOwnProperty(key)) continue
                    next[key] = prev[key]
                }
            }

            for( var key in patch ) {
                if( !patch.hasOwnProperty( key ) ) continue
                next[ key ] = patch[ key ]
            }

            this.set( next )

            return this.owner
        }

        itemSet( key : string , value : ValueType ) {
            var patch : hashMap < ValueType > = {}
            patch[ key ] = value
            this.patch( patch )
        }

    }
    
}