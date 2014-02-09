$jin.klass({ '$jin.list': [ '$jin.wrapper' ] })

$jin.method( '$jin.list..bisect', function( check ){
    var list = this.raw()
    var lo = 0
    var hi = list.length
    
    if( !list.length ) return -1
    
    while( lo < hi ){
        var mid = ( lo + hi ) >> 1
        var val = list[ mid ]
        if( check( val ) ) hi = mid
        else lo = mid + 1
    }
    
    return lo
} )
