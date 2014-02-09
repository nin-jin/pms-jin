$jin.request = function( options ){
    var xhr = new XMLHttpRequest
    xhr.open( options.method || 'GET', options.uri, false )
    xhr.send( options.body )
    return xhr
}
