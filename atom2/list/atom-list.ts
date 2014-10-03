module $jin.atom2 {
    
    export class list<ItemType,OwnerType extends $jin.object> extends $jin.atom2.transit<ItemType[],OwnerType> {
        
        _merge( next : ItemType[] , prev : ItemType[] ) {
            if( !next || !prev ) return next
            if( next.length !== prev.length ) return next
            
            for( var i = 0 ; i < next.length ; ++i ) {
                if( next[ i ] !== prev[ i ] ) return next
            }
            
            return prev
        }
        
        _get( value : ItemType[] ) {
            return value && value.slice( 0 )
        }

        append( values : ItemType[] ) {
            var value = this.get()
            value.push.apply( value, values )
            this.push( value )
        }

        prepend( values : ItemType[] ) {
            var value = this.get()
            value.unshift.apply( value, values )
            this.push( value )
        }

        cut( from : number , to : number ) {
            var value = this.get()
            value.splice( from, to )
            this.push( value )
        }

    }
    
}