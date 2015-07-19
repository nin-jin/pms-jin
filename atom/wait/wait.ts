module $jin.atom {

    export class wait {

        _nativeError : Error

        // prevent prints to console
        jin_log_isLogged = true

        constructor( public message : string ) {
            this._nativeError = new Error( message )
        }

        toString() {
            return String( this._nativeError )
        }

    }

}