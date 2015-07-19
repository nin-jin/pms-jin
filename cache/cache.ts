module $jin {

    export class cache {

        static prefix = '$jin.cache:'
        static name = '$jin.cache'
        static stripSize = 10

        static Storage() {
            return new $jin.prop.vary<any,any>({
                owner : $jin.cache,
                name : 'storage',
                pull : prop => {
                    try {
                        localStorage[''] = null
                        return window.localStorage
                    } catch( error ) {
                        return { clear : () => {
                           prop.pull()
                        } }
                    }
                }
            })
        }

        static Item( param : string ) {
            var key = this.prefix + param
            return new $jin.prop.proxy<any>({
                pull : () => {
                    try {
                        var cache = this.Storage().get()[key]
                        if (!cache) return null
                        return JSON.parse(cache)
                    } catch( error ) {
                        $jin.log.error( error )
                        return null
                    }
                },
                put : next => {
                    var value = JSON.stringify(next)
                    var storage = this.Storage().get()
                    for( var i = 0 ; i < this.stripSize ; ++i ) {
                        try {
                            storage[key] = value
                            return
                        } catch (error) {
                            this.strip()
                        }
                    }
                }
            })
        }

        static strip() {
            var storage = this.Storage().get()
            var keys = Object.keys( storage )
            var cacheKeys = keys.filter( key => !key.indexOf( this.prefix ) )
            var stripKeys = cacheKeys.sort( () => Math.random() - .5 ).slice( 0, cacheKeys.length / this.stripSize )
            stripKeys.forEach( key => {
                delete storage[ key ]
            } )
        }

    }

}