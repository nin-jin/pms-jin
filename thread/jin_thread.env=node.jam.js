/**
 * @name $jin.thread
 * @method thread
 * @static
 * @member $jin
 */
$jin.method({ '$jin.thread': function( proc ){
    return function $jin_thread_wrapper( ){
        try {
            proc.apply( this, arguments )
        } catch( error ){
            $jin.log.error( error )
        }
    }
}})
