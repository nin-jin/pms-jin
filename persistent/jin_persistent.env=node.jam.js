$jin.persistent = function( body, options ){
    
    $jin.application( process.env[ 'jin_persistent_body' ] ? body : supervisor )
    
    function supervisor( ){
        var app = null
        var allowRestart = false
        
        var start = function start_worker( ){
            $jin.log.info( 'Starting application...' )
            var env = Object.create( process.env )
            env[ 'jin_persistent_body' ] = true
            app= $node.child_process.fork( process.mainModule.filename, process.argv.slice(2), { env: env } )
            
            allowRestart = false
            var isStopped = false
            
            app.on( 'exit', function handle_exit( code ){
                if( code ) $jin.log.error( 'Application halted (' + code + ')' )
                else $jin.log.info( 'Application stopped' )
                app = null
                if( allowRestart ) start()
            } )
            
            var sleepTimer = setTimeout( function( ){
                allowRestart = true
            }, 30000 )
        }
        
        var restart = $jin.throttle( 250, function restart_wroker( ){
            allowRestart = true
            if( app ) app.kill()
            else start()
        } )
        
        start()
        
        $jin.file('.').listen( function handle_fs_changes( event ){
            var file = event.target() 
            
            if( file.name() === 'node_modules' ) return
            if( /(\\|\/)\W/i.test( file.path() ) ) return
            
            $jin.log.info( 'Changed [' + file.relate() + ']' )
            restart()
        } )
        
    }
    
}
