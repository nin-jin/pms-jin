module $jin.prop {

    export class vary<ValueType,HostType> extends $jin.object {

        constructor( config : {
            owner? : HostType
            name? : string
            get? : ( value : ValueType ) => ValueType
            pull? : ( prev : ValueType ) => ValueType
            merge? : ( next : ValueType, prev : ValueType ) => ValueType
            put? : ( next : ValueType, prev : ValueType ) => any
            clear? : ( prev : ValueType ) => any
        } ) {
            super( config.name )
            
            this._host = config.owner || this
            if( config.pull ) this._pull = config.pull
            if( config.get ) this._get = config.get
            if( config.merge ) this._merge = config.merge
            if( config.put ) this._put = config.put
            if( config.clear ) this._clear = config.clear
            
            return this
        }

        private _host : HostType
        private _get( value : ValueType ){
            return value
        }
        private _pull( prev : ValueType ){
            return prev
        }
        private _merge( next : ValueType , prev : ValueType ){
            return next
        }
        private _put( next : ValueType , prev : ValueType ){
            this._host[ this.objectName ] = next
        }
        private _clear( prev : ValueType ){
        }

        clear() {
            var prev = this._host[ this.objectName ]
            this._host[ this.objectName ] = undefined
            this._clear( prev )
        }

        value( ) : ValueType {
            return this._host[ this.objectName ]
        }

        push( next : ValueType ) : ValueType {
            next = this._merge( next, this.value() )
            this._host[ this.objectName ] = next
            return next
        }

        get() : ValueType {
            var value = this.value()
            if( value === undefined ){
                value = this._pull( value )
                value = this._merge( value, value )
                this._host[ this.objectName ] = value
            }
            return this._get( value )
        }

        pull() : ValueType {
            var value = this.value()
            value = this._pull( value )
            value = this.push( value )
            return value
        }

        set( next : ValueType ){
            var prev = this.value()
            next = this._merge( next, prev )
            if( next !== prev ){
                this._put( next , prev )
            }
        }

    }

}
