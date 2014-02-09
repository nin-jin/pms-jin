$jin.identical = function( a, b ){
    if(( typeof a === 'number' )&&( typeof b === 'number' )){
        return String( a ) === String( b )
    }
    
    return ( a === b )
}
