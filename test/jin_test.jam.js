/**
 * @name $jin.test
 * @class $jin.test
 * @returns $jin.test
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.test': [] })

/**
 * @name $jin.test.completeList
 * @method completeList
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.completeList': Array })

/**
 * @name $jin.test.pendingList
 * @method pendingList
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.pendingList': Array })

/**
 * @name $jin.test.running
 * @method running
 * @static
 * @member $jin.test
 */
$jin.property({ '$jin.test.running': Array })

/**
 * @name $jin.test.start
 * @method start
 * @static
 * @member $jin.test
 */
$jin.method({ '$jin.test.start': function( ){
	setTimeout( function(){
		var next = this.pendingList().shift()
		if( next ) next.run()
	}.bind( this ), 0 )
}})

/**
 * @name $jin.test#code
 * @method code
 * @member $jin.test
 */
$jin.property({ '$jin.test..code': null })

/**
 * @name $jin.test#passed
 * @method passed
 * @member $jin.test
 */
$jin.property({ '$jin.test..passed': Boolean })

/**
 * @name $jin.test#timeout
 * @method timeout
 * @member $jin.test
 */
$jin.property({ '$jin.test..timeout': Number })

/**
 * @name $jin.test#timer
 * @method timer
 * @member $jin.test
 */
$jin.property({ '$jin.test..timer': null })

/**
 * @name $jin.test#asserts
 * @method asserts
 * @member $jin.test
 */
$jin.property({ '$jin.test..asserts': Array })

/**
 * @name $jin.test#results
 * @method results
 * @member $jin.test
 */
$jin.property({ '$jin.test..results': Array })

/**
 * @name $jin.test#errors
 * @method errors
 * @member $jin.test
 */
$jin.property({ '$jin.test..errors': Array })

/**
 * @name $jin.test#init
 * @method init
 * @member $jin.test
 */
$jin.method({ '$jin.test..init': function( code ){
    this['$jin.klass..init']
    this.code( code )
	this.constructor.pendingList().push( this )
    return this
}})

/**
 * @name $jin.test#destroy
 * @method destroy
 * @member $jin.test
 */
$jin.method({ '$jin.test..destroy': function( destroy ){
    var completeList = this.constructor.completeList()
    var pendingList = this.constructor.pendingList()
    
    completeList.splice( completeList.indexOf( this ), 1 )
    pendingList.splice( pendingList.indexOf( this ), 1 )
    
    return this['$jin.klass..destroy']()
}})

/**
 * @name $jin.test#run
 * @method run
 * @member $jin.test
 */
$jin.method({ '$jin.test..run': function( ){
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
}})

/**
 * @name $jin.test#done
 * @method done
 * @member $jin.test
 */
$jin.property({ '$jin.test..done': function( done ){
    if( !arguments.length ) return false
    if( this.done() ) return true
	
    this.timer( clearTimeout( this.timer() ) )
    
    var passed = true
    this.asserts().forEach( function( assert ){
        passed = passed && assert
    })
    this.passed( passed )
    
    this.constructor.completeList().push( this )
	this.constructor.start()

    return this
}})
    
/**
 * @name $jin.test#fail
 * @method fail
 * @member $jin.test
 */
$jin.method({ '$jin.test..fail': function(){
    throw new Error( 'Failed' )
}})

/**
 * @name $jin.test#ok
 * @method ok
 * @member $jin.test
 */
$jin.method({ '$jin.test..ok': function( value ){
    if( value ) return this
    
    throw new Error( 'Not true (' + value + ')' )
}})

/**
 * @name $jin.test#not
 * @method not
 * @member $jin.test
 */
$jin.method({ '$jin.test..not': function( value ){
    if( !value ) return this
    
    throw new Error( 'Not false (' + value + ')' )
}})

/**
 * @name $jin.test#equal
 * @method equal
 * @member $jin.test
 */
$jin.method({ '$jin.test..equal': function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( passed ) continue
        
        throw new Error( 'Not equal (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
}})

/**
 * @name $jin.test#unique
 * @method unique
 * @member $jin.test
 */
$jin.method({ '$jin.test..unique': function( ){
    var valueList = [].slice.call( arguments )
    
    for( var i= 1; i < valueList.length; ++i ){
        var passed = $jin.identical( valueList[ i ], valueList[ i - 1 ] )
        if( !passed ) continue
        
        throw new Error( 'Not unique (' + valueList.join( '), (' ) + ')' )
    }
    
    return this
}})

/**
 * @name $jin.test#callback
 * @method callback
 * @member $jin.test
 */
$jin.method({ '$jin.test..callback': function( func ){
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
}})

/**
 * @name $jin.test#mockHash
 * @method mockHash
 * @member $jin.test
 */
$jin.property({ '$jin.test..mockHash': Object })

/**
 * @name $jin.test#mock
 * @method mock
 * @member $jin.test
 */
$jin.method({ '$jin.test..mock': function( path, value ){
    var mock = $jin.mock({ path: path, value: value, mocking: true })
    this.mockHash()[ path ] = mock
    return mock
}})
