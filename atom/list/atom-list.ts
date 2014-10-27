module $jin.atom {
    
    export class list<ItemType,OwnerType extends $jin.object> extends $jin.atom.prop<ItemType[],OwnerType> {
        
        merge( next : ItemType[] , prev : ItemType[] ) {
            next = super.merge( next , prev )
            
            if( !next || !prev ) return next
            if( next.length !== prev.length ) return next
            
            for( var i = 0 ; i < next.length ; ++i ) {
                if( next[ i ] !== prev[ i ] ) return next
            }
            
            return prev
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