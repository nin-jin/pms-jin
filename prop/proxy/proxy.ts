module $jin.prop {

    export class proxy<ValueType> {

        constructor( config : {
            pull? : () => ValueType
            put? : ( next : ValueType ) => void
        } ){
            if( config.pull ) this.get = config.pull
            if( config.put ) this.set = config.put
            return this
        }

        get() : ValueType {
            return undefined
        }

        set( next : ValueType ){
        }

    }

}