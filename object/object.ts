module $jin {
    
    // Common object behaviour:
    // - Unique identifier
    // - Control lifetime
    export class object {
        
        // Seed for identifiers
        private static _object_seed = 0

        // Creates subclass with fields from config
        static create( config ) {
            var parent = this
            var klass = config.hasOwnProperty( 'constructor' ) ? config['constructor'] : function( ){
                parent.apply( this, arguments )
            }
            klass.prototype = Object.create( this.prototype )
            for( var key in config ) {
                klass.prototype[ key ] = config[ key ]
            }
            return klass
        }
        
        //static _owner : $jin.object
        
        _owner : $jin.object
        
        //static objectName : string
        
        // Name unique for owner
        objectName : string
        
        constructor( name? : string ) {
            this.objectName = name || '' + ++$jin.object._object_seed
        }
        
        destroy() {
            this.havings.forEach( having => having.destroy() )
            this.owner = null
        }
        
        // Objects whose owner is this, they destroys when owner destroys
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
        
        // Object which control lifetime of this
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
        
        // Human readable unique identifier
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