module $jin {
    export class socket extends $jin.model < $jin.object<any> > {

        NativeSocket() {
            return new $jin.prop.vary<WebSocket,$jin.socket>({
                owner : this,
                name : 'nativeSocket',
                pull : atom => {

                    var socket = new WebSocket( location.protocol.replace( 'http' , 'ws' ) + '//' + location.host, 'jin-server' )

                    socket.onopen = $jin.defer.callback( () => {
                        atom.owner.IsOnLine().push( true )
                    } )
                    socket.onclose = $jin.defer.callback( () => {
						atom.owner.IsOnLine().clear()
						atom.owner.NativeSocket().pull()
                    } )
                    socket.onmessage = $jin.defer.callback( ( event ) => {
                        var message = JSON.parse( event.data )
                        if( message.requestId && atom.owner[ message.requestId ] ) {
							atom.owner[ message.requestId ].push( message )
                        }
						atom.owner.LastMessage().push( message )
                    } )

                    return socket
                }
            })
        }

        IsOnLine() {
            return new $jin.atom.prop<boolean,$jin.socket>({
                owner: this,
                name: 'isOnLine',
                pull: atom => {
                    return atom.owner.NativeSocket().get().readyState === WebSocket.OPEN ? true : undefined
                }
            })
        }

        LastMessage() {
            return new $jin.atom.prop<any,$jin.socket>({
                owner: this,
                name: 'lastMessage',
                pull: atom => {
                    atom.owner.NativeSocket().get()
                    return null
                }
            })
        }

        send( message ) {

            var promise = new $jin.atom.prop({
                owner : this
            })

            message.requestId = promise.name

            this.IsOnLine().then( () => {
                this.NativeSocket().get().send( JSON.stringify( message , null , '\t' ) )
            })

            return promise
        }

    }
}