module $jin.view {

    export class active extends $jin.object<any> {

        static objectId = '$jin.view.active'

        static ListenerFocus() {
            var listener = new $jin.atom.prop<any,typeof $jin.view.active>({
                owner: this,
                name: 'listenerFocus',
                pull: atom => {
                    window.addEventListener( 'focus', handler, true )
                    return null
                },
                reap: atom => {
                    window.removeEventListener( 'focus', handler, true )
                    atom.destroy()
                }
            })
            var handler = (event) => this.Sample().push( event.target.jin_sample )
            return listener
        }

        static ListenerBlur() {
            var listener = new $jin.atom.prop<any,typeof $jin.view.active>({
                owner: this,
                name: 'listenerBlur',
                pull: atom => {
                    window.addEventListener( 'blur', handler, true )
                    return null
                },
                reap: atom => {
                    window.removeEventListener( 'blur', handler, true )
                    atom.destroy()
                }
            })
            var handler = (event) => this.Sample().push( null )
            return listener
        }

        static Sample() {
            return new $jin.atom.prop<$jin.view.sample<any>,typeof $jin.view.active>({
                owner: this,
                name: 'sample',
                pull: atom => {
                    atom.owner.ListenerBlur().get()
                    atom.owner.ListenerFocus().get()
                    return null
                }
            })
        }

        static Model() {
            return new $jin.atom.prop<$jin.view.model<any>,typeof $jin.view.active>({
                owner: this,
                name: 'model',
                pull: atom => {
                    var sample = atom.owner.Sample().get()
                    if( !sample ) return null
                    return sample.view
                }
            })
        }

    }

}
