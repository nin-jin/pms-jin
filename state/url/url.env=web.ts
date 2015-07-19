module $jin.state {

    export class urlImplementation extends $jin.object<any> {
        static objectId = '$jin.state.url'

        Listener() {
            var listener = new $jin.atom.prop({
                owner : this,
                name : 'listener',
                pull : atom => {
                    window.addEventListener( 'hashchange' , handler , false )
                    return null
                },
                reap : atom => {
                    window.removeEventListener( 'hashchange' , handler , false )
                    atom.destroy()
                }
            })
            var handler = ( event ) => listener.notify()
            return listener
        }

        Href() {
            return new $jin.atom.prop<string,typeof url>({
                owner : this,
                name : 'href',
                pull : atom => {
                    atom.owner.Listener().get()
                    return window.location.search + window.location.hash
                },
                put : ( atom , next , prev ) => {
                    document.location.href = next
                    //history.pushState( {} , '' , next )
                    //var evt = document.createEvent("PopStateEvent");
                    //evt.initEvent("popstate", false, false);
                    //window.dispatchEvent(evt);
                }
            })
        }

        Map() {
            return new $jin.atom.prop<any,typeof url>({
                owner : this,
                name : 'url',
                pull : atom => {
                    var href = atom.owner.Href().get()
                    var chunks = href.split( /(?:\/|\?|#!?|&|;)/g )
                    var params = {}
                    chunks.forEach( chunk => {
                        if( !chunk ) return
                        var vals = chunk.split( /[:=]/ ).map( decodeURIComponent )
                        params[ vals.shift() ] = vals
                    })
                    return params
                },
                put : ( atom , next , prev ) => {
                    atom.owner.Href().set( atom.owner.make( next ) )
                }
            })
        }

        Item( key ) {
            return new $jin.atom.prop<string[],typeof url>({
                owner : this,
                name : 'item',
                param : key,
                pull : atom => {
                    return atom.owner.Map().get()[ atom.param ]
                },
                put : ( atom , next ) => {
                    var diff = {}
                    diff[ atom.param ] = next
                    atom.owner.Map().set( diff )
                }
            })
        }

        override( next ) {
            var params = {}

            var prev = this.Map().get()
            for( var key in prev ) {
                if( key in next ) continue
                params[ key ] = prev[ key ]
            }

            for( var key in next ) {
                params[ key ] = next[ key ]
            }

            return this.make( params )
        }

        make( next ) {
            var chunks = []
            for( var key in next ) {
                if( !next[key] ) continue
                chunks.push( [ key ].concat( next[key] ).map( encodeURIComponent ).join( '=' ) )
            }

            return '#!' + chunks.join( ';' )
        }

    }

    export var url = new urlImplementation({ })

}
/*
document.addEventListener( 'click', function( e ){
    if( e.defaultPrevented ) return
    if( e.ctrlKey ) return
    if( e.shiftKey ) return
    if( e.metaKey ) return
    if( e.altKey ) return

    var target = <Element>e.target
    while( true ) {
        if( !target ) return
        if( target.localName === 'a' ) break
        target = <Element>target.parentNode
    }

    var href = target['href']
    if( !href ) return
    if( href.indexOf( document.location.protocol + '//' + document.location.host + '/' ) !== 0 ) return

    e.preventDefault()
    $jin.state.url.Href().set( href )
},false)
*/