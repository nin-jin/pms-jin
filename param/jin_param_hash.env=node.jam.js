/**
 * @name $jin.param.hash
 * @method hash
 * @static
 * @member $jin.param
 */
$jin.property({ '$jin.param.hash': function( ){
    var param = {}
    for( var index = 2; index < process.argv.length; ++index ){
        var values = process.argv[ index ].split( '=' )
        param[ values.shift() ] = values
    }
    return param
}})
