/**
 * @name $jin.param.hash
 * @method hash
 * @static
 * @member $jin.param
 */
$jin.property({ '$jin.param.hash': function( ){
    var param = {}
    var query = document.location.search + document.location.hash
    var chunks = query.split( /[&;?#]/g )
    chunks.forEach( function( chunk ){
        var values = chunk.split( /[:=]/ )
        values = values.map( decodeURIComponent )
        param[ values.shift() ] = values
    } )
    return param
}})
