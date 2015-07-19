module $jin {

    export class error {

        private _nativeError

        constructor(
            public message : string ,
            public info? : { [ index : string ] : any }
        ) {
            this._nativeError = new Error( message )
            console.assert( false , this.toString() )
        }

        get stack() {
            return this._nativeError.stack
        }

        toString() {
            return this.message + '\n' + JSON.stringify( this.info )
        }

    }

}