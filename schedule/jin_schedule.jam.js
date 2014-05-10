/**
 * @name $jin.schedule
 * @method schedule
 * @static
 * @member $jin
 */
$jin.method({ '$jin.schedule': function( delay, handler ){
    var id = setTimeout( $jin.defer.callback( handler ), delay )
    return { destroy: function( ){
        clearTimeout( id )
    } }
}})
