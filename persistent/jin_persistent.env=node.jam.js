$jin.persistent = function( body, options ){
    
    $jin.application( process.env[ 'jin_persistent_body' ] ? body : supervisor )
    
    function supervisor( ){
        var app = null
        var allowRestart = false
        
        function start( ){
            console.info( $node['cli-color'].yellow( 'jin_persistent: Starting application...' ) )
            var env = Object.create( process.env )
            env[ 'jin_persistent_body' ] = true
            app= $node.child_process.fork( process.mainModule.filename, process.argv.slice(2), { env: env } )
            
            allowRestart = false
            var isStopped = false
            
            app.on( 'exit', function( code ){
                if( code ) console.error( $node['cli-color'].redBright( 'jin_persistent: Application halted (' + code + ')' ) )
                else console.info( $node['cli-color'].yellow( 'jin_persistent: Application stopped.' ) )
                app = null
                if( allowRestart ) start()
            } )
            
            var sleepTimer = setTimeout( function( ){
                allowRestart = true
            }, 30000 )
        }
        
        var restart = $jin.throttle( 250, function restart( ){
            allowRestart = true
            if( app ) app.kill()
            else start()
        } )
        
        start()
        
        $jin.file('.').listen( function( event ){
            var file = event.target() 
            
            if( file.name() === 'node_modules' ) return
            if( /(\\|\/)\W/i.test( file.path() ) ) return
            
            console.info( $node['cli-color'].green( 'jin_persistent: Changed [' + file.relate() + ']' ) )
            restart()
        } )
        
    }
    
}
