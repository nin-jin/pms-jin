module $jin.prop {

    export class proxy<ValueType,HostType> {

        constructor( config : {
            host? : HostType
            pull? : () => ValueType
            put? : ( next : ValueType ) => void
        } ){
            this._host = config.host
            if( config.pull ) this.get = config.pull
            if( config.put ) this.set = config.put
            return this
        }

        private _host : HostType

        get() : ValueType {
            return undefined
        }

        set( next : ValueType ){
        }

    }

}