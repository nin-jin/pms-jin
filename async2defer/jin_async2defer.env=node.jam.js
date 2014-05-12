/**
 * Трансформирует асинхронную  процедуру вида
 *
 *     function( ... , callback: function( error, result ) )
 *
 * в псевдосинхронную функцию вида
 *
 *     function( ... ) : result
 *
 * которая возвращает прокси, который останавливает текущее волокно, в момент обращения к его значению.
 *
 * Используется для автоматического распарралеливания асинхронных запросов:
 *
 *     var get = $jin.async2defer( $node.request.get )
 *
 * Последовательное исполнение:
 *
 *     console.log( get( "http://example.org/1" ).statusCode ) // request1, sync1
 *     console.log( get( "http://example.org/2" ).statusCode ) // resuest2, sync2
 *
 * Параллельное исполнение:
 *
 *     var response1 = get( "http://example.org/1" ) // request1
 *     var response2 = get( "http://example.org/2" ) // request2
 *     console.log( response1.statusCode ) // sync1
 *     console.log( response2.statusCode ) // sync2
 *
 * @name $jin.async2defer
 * @method async2defer
 * @param {function} func
 * @returns {function}
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
