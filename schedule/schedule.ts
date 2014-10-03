module $jin {
    export class schedule {

        static _queue : $jin.defer[] = []

        _handler : () => void
        _timer : number

        constructor( timeout : number , handler : () => void ) {
            this._handler = handler
            this.start( timeout )
        }
        
        isScheduled() {
            return this._timer != null
        }
        
        start( timeout : number ) {
            if( this._timer ) return
            this._timer = setTimeout( this._handler, timeout )
        }

        stop( ) {
            clearTimeout( this._timer )
            this._timer = null
        }

        destroy() {
            this.stop()
        }
    }
}