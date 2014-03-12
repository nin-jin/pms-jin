$jin.klass({ '$jin.test': [] })

$jin.property( '$jin.test.completeList', Array )
$jin.property( '$jin.test.pendingList', Array )
$jin.property( '$jin.test.running', Array )
$jin.property( '$jin.test.timer', null )

$jin.method( '$jin.test.next', function( next ){
	if( arguments.length ) this.pendingList().push( next )
	
	clearTimeout( this.timer() )
	this.timer( setTimeout( function( ){
	    var next = this.pendingList()[0]
		if( next ) next.run()
	}.bind( this ), 0 ) )
} )

$jin.property( '$jin.test..code', null )

$jin.property( '$jin.test..passed', Boolean )
$jin.property( '$jin.test..timeout', Number )
$jin.property( '$jin.test..timer', null )

$jin.property( '$jin.test..asserts', Array )
$jin.property( '$jin.test..results', Array )
$jin.property( '$jin.test..errors', Array )

$jin.method( '$jin.klass..init', '$jin.test..init', function( code ){
    this.code( code )
	this.constructor.next( this )
    return this
} )

$jin.method( '$jin.klass..destroy', '$jin.test..destroy', function( destroy ){
    var completeList = this.constructor.completeList()
    var pendingList = this.constructor.pendingList()
    
    completeList.splice( completeList.indexOf( this ), 1 )
    pendingList.splice( pendingList.indexOf( this ), 1 )
    
    return this['$jin.klass..destroy']()
} )

$jin.method( '$jin.test..run', function( ){
    var test = this
    
    var complete = false
    this.callback( function( ){
        if( typeof this.code() === 'string' )
            this.code( new Function( 'test', this.code() ) )
        
        this.code()( this )
        complete = true
    } ).call( this )
    
    this.asserts().push( complete )
    
    if( this.timeout() ){
        if( !this.done() ){
            this.timer( setTimeout( this.callback( function( ){
                test.asserts().push( false )
                var error = new Error( 'timeout (' + test.timeout() + ') of ' + test.code() )
                test.errors().push( error )
                test.done( true )
                throw error
            }), this.timeout() ))
        }
    } else {
        this.done( true )
    }
} )

$jin.property( '$jin.test..done', function( done ){
    if( !arguments.length ) return false
    
    this.timer( clearTimeout( this.timer() ) )
    
    var passed = true
    this.asserts().forEach( function( assert ){
        passed = passed && assert
    })
    this.passed( passed )
    
    this.constructor.completeList().push( this )
    var pendingList = this.constructor.pendingList()
    pendingList.splice( pendingList.indexOf( this ), 1 )
	
	this.constructor.next()

    return this
} )
    
$jin.method( '$jin.test..fail', function(){
    throw new Error( 'Failed' )
} )

$jin.method( '$jin.test..ok', function( value ){
    if( value ) return this
    
    throw new Error( 'Not true (' + value + ')' )
} )

$jin.method( '$jin.test..not', function( value ){
    if( !value ) return this
    
    throw new Error( 'Not false (' + value + ')' )
} )

$jin.method( '$jin.test..equal', function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( passed ) continue
        
        throw new Error( 'Not equal (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
} )

$jin.method( '$jin.test..unique', function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( !passed ) continue
        
        throw new Error( 'Not unique (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
} )

$jin.method( '$jin.test..callback', function( func ){
    var test = this
    return $jin.thread( function( ){
        var mockHash = test.mockHash()
        try {
            for( var name in mockHash ) mockHash[ name ].mocking( true )
            return func.apply( this, arguments )
        } catch( error ){
            test.errors().push( error )
            throw error
        } finally {
            for( var name in mockHash ) mockHash[ name ].mocking( false )
        }
    } )
} )

$jin.property( '$jin.test..mockHash', Object )

$jin.method( '$jin.test..mock', function( path, value ){
    var mock = $jin.mock({ path: path, value: value, mocking: true })
    this.mockHash()[ path ] = mock
    return mock
} )
