function $jin_log( ...values : any[] ) {
    if( typeof console === 'undefined' ) return

    console.log( console, arguments )

    return arguments[0]
}

function $jin_log_info( message : string , ...values : any[] ) {
    if( typeof console === 'undefined' ) return
    if( !$jin_log_filter.test( message ) ) return

    return console.info.apply( console, arguments )
}

function $jin_log_warn( message : string , ...values : any[] ) {
    if( typeof console === 'undefined' ) return
    if( !$jin_log_filter.test( message ) ) return

    return console.warn.apply( console, arguments )
}

function $jin_log_error( error ) {
    if( typeof console === 'undefined' ) return

    if( error.jin_log_isLogged ) return

    var message = error.stack || error

    if( console['exception'] ) console['exception']( error )
    else if( console.error ) console.error( message )
    else if( console.log ) console.log( message )

    error.jin_log_isLogged = true
}

function $jin_log_error_ignore( error ){
    error.jin_log_isLogged = true
    return error
}

var $jin_log_filter = /^$/