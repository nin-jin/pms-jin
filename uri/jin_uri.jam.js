/**
 * @name $jin.uri
 * @class $jin.uri
 * @returns $jin.uri
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.uri': [] })

/**
 * @name $jin.uri.chunkSep
 * @method chunkSep
 * @static
 * @member $jin.uri
 */
$jin.property({ '$jin.uri.chunkSep': function( sep ){
    return '&'
}})

/**
 * @name $jin.uri.valueSep
 * @method valueSep
 * @static
 * @member $jin.uri
 */
$jin.property({ '$jin.uri.valueSep': function( sep ){
    return '='
}})

/**
 * @name $jin.uri.escape
 * @method escape
 * @static
 * @member $jin.uri
 */
$jin.method({ '$jin.uri.escape': function( str ){
    return String( str )
    .replace
    (   /[^- a-zA-Z\/?:@!$'()*+,._~\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\u10000-\u1FFFD\u20000-\u2FFFD\u30000-\u3FFFD\u40000-\x{4FFFD\u50000-\u5FFFD\u60000-\u6FFFD\u70000-\u7FFFD\u80000-\u8FFFD\u90000-\u9FFFD\uA0000-\uAFFFD\uB0000-\uBFFFD\uC0000-\uCFFFD\uD0000-\uDFFFD\uE1000-\uEFFFD\uE000-\uF8FF\uF0000-\uFFFFD\u100000-\u10FFFD}]+/
    ,   encodeURIComponent
    )
    .replace( / /g, '+' )
}})


/**
 * @name $jin.uri#scheme
 * @method scheme
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..scheme': String })

/**
 * @name $jin.uri#slashes
 * @method slashes
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..slashes': Boolean })

/**
 * @name $jin.uri#login
 * @method login
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..login': String })

/**
 * @name $jin.uri#password
 * @method password
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..password': String })

/**
 * @name $jin.uri#host
 * @method host
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..host': String })

/**
 * @name $jin.uri#port
 * @method port
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..port': Number })

/**
 * @name $jin.uri#path
 * @method path
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..path': String })

/**
 * @name $jin.uri#query
 * @method query
 * @member $jin.uri
 */
$jin.property.hash({ '$jin.uri..query': {} })

/**
 * @name $jin.uri#hash
 * @method hash
 * @member $jin.uri
 */
$jin.property({ '$jin.uri..hash': String })

/**
 * @name $jin.uri#json
 * @method json
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..json': function( json ){
    if( arguments.length ) return this['$jin.klass..json']( json )
    
    json = {}
    json.scheme = this.scheme()
    json.slashes = this.slashes()
    json.login = this.login()
    json.password = this.password()
    json.host = this.host()
    json.port = this.port()
    json.path = this.path()
    
    var query = this.query()
    json.query = {}
    for( key in query ) json.query[ key ] = query[ key ]
    
    json.hash = this.hash()
    
    return json
}})

/**
 * @name $jin.uri#resolve
 * @method resolve
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..resolve': function( str ){
    var uri = $jin.uri.parse( String( str ) )
    
    if( !uri.scheme() ) uri.scheme( this.scheme() )
    else return uri
    
    if( !uri.slashes() ) uri.slashes( this.slashes() )
    if( !uri.host() ){
        uri.login( this.login() )
        uri.password( this.password() )
        uri.host( this.host() )
        uri.port( this.port() )
    } else {
        return uri
    }
    
    if( uri.path()[0] !== '/' ) uri.path( this.path().replace( /[^\/]+$/, '' ) + uri.path() )
    else return uri
    
    return uri
}})

/**
 * @name $jin.uri#toString
 * @method toString
 * @member $jin.uri
 */
$jin.method({ '$jin.uri..toString': function( ){
    var Uri = this.constructor
    
    var link = ''
    
    if( this.scheme() ) link += this.scheme() + ':'
    if( this.slashes() ) link += '//'
    
    if( this.login() ){
        link += this.login()
        if( this.password() ) link += ':' + this.password()
        link += '@'
    }
    
    if( this.host() ) link += this.host()
    if( this.port() ) link += ':' + Number( this.port() )
    if( this.path() ) link += this.path()
    
    var chunks = []
    for( var key in this.query() ){
        var chunk = [ key ].concat( this.query()[ key ] ).map( function( val ){ return Uri.escape( val ) }).join( Uri.valueSep() )
        chunks.push( chunk )
    }
    if( chunks.length ){
        link += '?' + chunks.join( Uri.chunkSep() )
    }
    
    if( this.hash() ) link = '#' + this.hash()
    
    return link
}})

/**
 * @name $jin.uri.parse
 * @method parse
 * @static
 * @member $jin.uri
 */
$jin.method({ '$jin.uri.parse': function( string ){
    var Uri = this
    
    var config = {}
    
    config.path = string
    .replace( /#(.*)$/, function( str, hash ){
        config.hash = hash
        return ''
    } )
    .replace( /\?(.*)$/, function( str, queryString ){
        var chunkList = queryString.split( Uri.chunkSep() )
        var query = {}
        chunkList.forEach( function( chunk ){
            var values = chunk.split( Uri.valueSep() ).map( decodeURIComponent )
            var key = values.shift()
            query[ key ] = values
        }.bind(this) )
        config.query = query
        return ''
    } )
    .replace( /^([^\/:@]+):/, function( str, scheme ){
        config.scheme = scheme
        return ''
    } )
    .replace( /^(\/\/[^\/]*)/, function( str, origin ){
        config.host = origin
        .replace( /:(\d+)$/, function( str, port ){
            config.port = port
            return ''
        } )
        .replace( /^([^@]+)@/, function( str, auth ){
            var pair = auth.split( ':' )
            config.login = pair[0]
            config.password = pair[1]
            return ''
        } )
        .replace( /^\/\//, function( str, port ){
            config.slashes = true
            return ''
        } )
        return ''
    } )
    
    return this( config )
}})
