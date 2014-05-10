/**
 * @name $jin.async2defer
 * @method async2defer
 * @static
 * @member $jin
 */
$jin.method({ '$jin.async2defer': function( func ){
    return $jin.proxy
    (   {   apply:
            function( func, self, args ){
                var fiber= null
                var result= null
                var error= null
                var done= false
                
                var onDone = function( err, res ){
                    
                    result= res
                    error= err
                    done= true
                    
                    if( fiber ){
                        fiber.run( )
                        fiber= null
                    }
                }
                
                void [].push.call( args, onDone )
                
                var domain = $node.domain.create()
                domain.on( 'error', onDone )
                domain.run( function(){
                    void func.apply( self, args )
                })
                
                if( done ){
                    if( error ) throw error
                    return result
                }
                
                return $jin.lazyProxy( function( ){ 
                    if( !done ){
                        var fibers= $node.fibers
                        fiber= fibers.current
                        fibers.yield()
                        if( error ) error.stack+= '\n--fiber--' + (new Error).stack.replace( /^[^\n]*/, '' )
                    }
                    
                    if( error ) throw error
                    return result
                } )
            }
        }
    )( func )
}})
