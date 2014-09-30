module $jin {
    
    export class object {
        
        private static _object_seed = 0
        
        //static _owner : $jin.object
        _owner : $jin.object
        
        //static objectName : string
        objectName : string
        
        constructor( name? : string ) {
            this.objectName = name || '' + ++$jin.object._object_seed
        }
        
        destroy() {
            this.havings.forEach( having => having.destroy() )
            this.owner = null
        }
        
        get havings() {
            var havings = []
            for( var field in this ) {
                if( !this.hasOwnProperty( field ) ) continue
                var value = this[ field ]
                if( !value ) continue
                if( value.owner !== this ) continue
                havings.push( value )
            }
            return havings
        }

        set owner( owner : $jin.object ) {
            if( owner ){
                owner[ this.objectName ] = this
            } else {
                if( !this._owner ) return
                this._owner[ this.objectName ] = null
            }
            this._owner = owner
        }
        
        get owner() {
            return this._owner
        }
        
        get objectPath() {
            var path = this.objectName
            if( this._owner ) path = this._owner.objectPath + '.' + path
            return path
        }

        toString() {
            return this.objectName
        }

    }
    
}