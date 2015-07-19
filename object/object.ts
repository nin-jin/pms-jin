module $jin {

    // Common object behaviour:
    // - Unique identifier
    // - Control lifetime
    // - Runtime create subclasses
    export class object < OwnerType extends { objectId : string } > {

        static objectId = '$jin.object'
        private static _objectIdSeed = 0

        static makeConstructor( parent ) {
            return function jin_object( ){
                parent.apply( this, arguments )
            }
        }

        static makeClass( config ) {
            var parent = this

            var klass = config.hasOwnProperty( 'constructor' )
                ? config['constructor']
                : this.makeConstructor( parent )

            klass.prototype = Object.create( this.prototype )

            for( var key in this ) {
                if( this[ key ] === void 0 ) continue
                klass[ key ] = this[ key ]
            }

            for( var key in config ) {
                if( config[ key ] === void 0 ) continue
                klass.prototype[ key ] = config[ key ]
            }

            return <typeof parent> klass
        }

        objectId : string
        name : string

        constructor( config : {
            owner? : OwnerType
            name? : string
        } ) {
            var name = config.name || ( '_' +  ++$jin.object._objectIdSeed )
            this.name = name

            var owner = config.owner || <any>this.constructor
            //if( owner[ name ] ) return owner[ name ]

            this.objectId = owner.objectId + '.' + name
            this.owner = owner
        }

        destroy() {
            this.havings.forEach( obj => {
                obj.destroy()
            } )
            this.owner = null
        }

        get havings( ) {
            var havings = []
            for( var key in this ) {
                if( !this.hasOwnProperty( key ) ) continue
                var value = this[ key ]
                if( !value ) continue
                if( value._owner !== this ) continue
                if( havings.indexOf( value ) === -1 ) havings.push( value )
            }
            return havings
        }

        _owner : OwnerType
        set owner( next : OwnerType ) {
            var prev = this._owner
            if( next === prev ) return
            if( prev ) {
                prev[ this.name ] = null
            }
            if( next ) {
                //if( next[ this.name ] && next[ this.name ] !== this ) {
                //    throw new $jin.error( 'Having name conflict', { name : this.name } )
                //} else {
                    next[ this.name ] = this
                //}
            }
            this._owner = next
        }
        get owner() {
            return this._owner
        }

        get overLord() {
            var owner = this.owner
            if( !owner ) return this

            return owner['overLord']
        }

    }

    export module object {
        export interface iface {
            objectId : string
        }
    }

}