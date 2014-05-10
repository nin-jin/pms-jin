/**
 * @name $jin.application
 * @method application
 * @static
 * @member $jin
 */
$jin.method({ '$jin.application': function( app, done ){
    return $jin.sync2async( app ).call( $jin.root(), done )
}})
