module $jin.dom2 {

    export class listener extends $jin.object<any> {

        node : Element
        events : string[]
        handler : ( Event ) => void

        constructor( config : {
            node : Element
            events : string[]
            handler : ( Event ) => void
        }) {
            super( config )

            this.node = config.node
            this.events = config.events
            this.handler  = config.handler

            this.listen()
        }

        destroy() {
            this.forget()
            super.destroy()
        }

        listen() {
            this.events.forEach( event => {
                this.node.addEventListener( event , this.handler , true )
            } )
        }

        forget() {
            this.events.forEach( event => {
                this.node.removeEventListener( event , this.handler , true )
            } )
        }
    }

}
