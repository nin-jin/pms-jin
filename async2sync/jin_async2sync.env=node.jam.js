/**
 * Трансформирует асинхронную процедуру вида
 *
 *     function( ... , callback: function( error, result ) )
 *
 * в псевдосинхронную функцию вида
 *
 *     function( ... ) : result
 *
 * которая останавливает текущее волокно до завершения асинхронной процедуры.
 *
 * Используется для работы с асинхронным апи в синхронном стиле:
 *
 *     var get = $jin.async2sync( $node.request.get )
 *     console.log( get( "http://example.org/1" ).statusCode )
 *
 * Важно, что исполнение этого кода уже должно происходить в волокне.
 *
 * @name $jin.async2sync
 * @method async2sync
 * @param {function} func
 * @returns {function}
 * @static
 * @member $jin
 */
$jin.method({ '$jin.async2sync': function( func ){
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
                
                if( !done ){
                    var fibers= $node.fibers
                    fiber= fibers.current
					var slave = $jin.atom1.current
                    var slave2 = $jin.atom.currentSlave
                    var defered = $jin.defer._queue
					$jin.atom1.current = null
                    $jin.atom.currentSlave = null
                    $jin.defer._queue = []
                    fibers.yield()
					$jin.atom1.current = slave
                    $jin.atom.currentSlave = slave2
                    $jin.defer._queue = defered
                    if( error ) error.stack+= '\n--fiber--' + (new Error).stack.replace( /^[^\n]*/, '' )
                }
                
                if( error ) throw error
                return result
            }
        }
    )( func )
}})
