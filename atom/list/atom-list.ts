module $jin.atom {
    
    export class list < ItemType , OwnerType extends $jin.object.iface > extends $jin.atom.prop < ItemType[] , OwnerType > {

        constructor( config ) {
            return <any>super( config )
        }

        merge( next : ItemType[] , prev : ItemType[] ) {
            next = super.merge( next , prev )
            
            if( !next || !prev ) return next
            if( next.length !== prev.length ) return next
            
            for( var i = 0 ; i < next.length ; ++i ) {
                if( next[ i ] !== prev[ i ] ) return next
            }
            
            return prev
        }

        notify( error? : Error , next? : ItemType[] , prev? : ItemType[] ) {
            super.notify( error , next , prev )
            if( prev ) {
                if( next ) {
                    var dropped = prev.filter( item => next.indexOf( item ) === -1 )
                } else {
                    var dropped = prev
                }
                dropped.forEach( item => {
                    if( !item ) return
                    if( item.owner === this ) return
                    item['destroy']()
                } )
            }
        }
        
        append( values : ItemType[] ) {
            var value = this.get()
            value.push.apply( value, values )
            this.notify( null , value )
        }

        prepend( values : ItemType[] ) {
            var value = this.get()
            value.unshift.apply( value, values )
            this.notify( null , value )
        }

        cut( from : number , to : number ) {
            var value = this.get()
            value.splice( from, to )
            this.notify( null , value )
        }
        
    }
    
}