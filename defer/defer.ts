module $jin {
    export class defer {
        
        static _queue : $jin.defer[] = []
        static _schedule : $jin.schedule
        
        static schedule( ) {
            if( this._schedule ) return
            if( !this._queue.length ) return
            
            this._schedule = new $jin.schedule( $jin.defer.run )
            this._schedule.start( 0 )
        }
        
        static start( defer : $jin.defer ) {
            this._queue.push( defer )
            this.schedule()
        }
        
        static stop( defer : $jin.defer ) {
            var index = this._queue.indexOf( defer )
            if( index >=0 ) this._queue.splice( index , 1 )
        }
        
        static callback( func ) {
            return function() {
                var result = func.apply( this, arguments )
                $jin.defer.run()
                return result
            }
        }

        static run() {
            $jin.defer._schedule = undefined
            $jin.defer.schedule()
            var defer
            while( defer = $jin.defer._queue.shift() ) {
                defer.run()
            }
        }
        
        _handler : () => void
        
        constructor( handler : () => void ) {
            this._handler = handler
            $jin.defer.start( this )
        }
        
        destroy() {
            $jin.defer.stop( this )
        }
        
        run() {
            this._handler()
        }
        
    }
}
