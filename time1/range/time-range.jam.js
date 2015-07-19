$jin.klass({ '$jin.time1.range': [] })

$jin.method({ '$jin.time1.range.exec': function( range ){
    switch( $jin_type( range ) ){
        case 'Object':
            if( range instanceof this ) return range;
            return this['$jin.klass.exec']([
                range.from,
                range.to
            ])
        case 'String':
            range = range.split( '/' )
        case 'Array':
            return this['$jin.klass.exec']({ from : range[0] , to : range[1] })
        default:
            throw new Error( 'Wrong type of time range (' + $jin_type( range ) + ')' )
    }
}})

$jin.method({ '$jin.time1.range..toString': function(){
    return this.from().toString() + '/' + this.to().toString()
}})

$jin.method({ '$jin.time1.range..toJSON': function( ){
    return this.toString()
}})

$jin.property({ '$jin.time1.range..from': $jin.time1.moment })

$jin.property({ '$jin.time1.range..to': $jin.time1.moment })
