module $jin.prop {
    
    export class vary<ValueType , OwnerType extends { objectId : string } > extends $jin.object < OwnerType > {
        
        constructor( config : {
            owner? : OwnerType
            name? : string
            get? : ( prop : $jin.prop.vary<ValueType,OwnerType> , value : ValueType ) => ValueType
            pull? : ( prop : $jin.prop.vary<ValueType,OwnerType> , prev : ValueType ) => ValueType
            merge? : ( prop : $jin.prop.vary<ValueType,OwnerType> , next : ValueType, prev : ValueType ) => ValueType
            notify? : ( prop : $jin.prop.vary<ValueType,OwnerType> , next : ValueType, prev : ValueType ) => void
            put? : ( prop : $jin.prop.vary<ValueType,OwnerType> , next : ValueType, prev : ValueType ) => any
            clear? : ( prop : $jin.prop.vary<ValueType,OwnerType> , prev : ValueType ) => any
        } ) {
            super({
                owner : config.owner || <any>this ,
                name : config.name || '_value'
            })

            if( config.pull ) this._pull = config.pull
            if( config.get ) this._get = config.get
            if( config.merge ) this._merge = config.merge
            if( config.notify ) this._notify = config.notify
            if( config.put ) this._put = config.put
            if( config.clear ) this._clear = config.clear
            
            return this
        }

        set owner( next : OwnerType ) {
            this._owner = next
        }
        get owner() {
            return this._owner
        }

        protected _get( prop : $jin.prop.vary<ValueType,OwnerType> , value : ValueType ){
            return value
        }
        protected _pull( prop : $jin.prop.vary<ValueType,OwnerType> , prev : ValueType ){
            return prev
        }
        protected _merge( prop : $jin.prop.vary<ValueType,OwnerType>, next : ValueType , prev : ValueType ){
            return next
        }
        protected _notify( prop : $jin.prop.vary<ValueType,OwnerType> , next : ValueType , prev : ValueType ){
        }
        protected _put( prop : $jin.prop.vary<ValueType,OwnerType> , next : ValueType , prev : ValueType ){
            this.push( next )
        }
        protected _clear( prop : $jin.prop.vary<ValueType,OwnerType> , prev : ValueType ){
        }

        clear() {
            var prev = this.owner[ this.name ]
            this.owner[ this.name ] = undefined
            this._clear( this , prev )
        }

        value( ) : ValueType {
            return this.owner[ this.name ]
        }

        push( next : ValueType ) : ValueType {
            var prev = this.owner[ this.name ]
            if( next === prev ) return next

            next = this._merge( this , next, prev )
            if( next === prev ) return next

            this.owner[ this.name ] = next

            this._notify( this , next , prev )

            return next
        }

        get() : ValueType {
            var host = this.owner
            var field = this.name
            var value = host[ field ]
            if( value === undefined ) {
                value = this.pull()
            }
            return this._get( this , value )
        }

        pull() : ValueType {
            var value = this.value()
            value = this._pull( this , value )
            value = this.push( value )
            return value
        }
        
        update() {
            if( this.value() !== undefined ) {
                this.pull()
            }
        }

        set( next : ValueType , prev : ValueType = this.value() ){
            next = this._merge( this , next, prev )
            if( next !== prev ){
                this._put( this , next , prev )
            }
            return this.owner
        }

    }

}
