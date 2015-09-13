declare var process : any
module $jin.db {
    
    export class oriento extends $jin.object < any > {
        
        uri : any
        
        constructor( uri ) {
            this.uri = $jin.uri.parse( uri )
            super({})
        }

        Server( ) {
            return new $jin.prop.vary<any,$jin.db.oriento>({
                owner : this,
                name : 'server',
                pull : prop => {
                    var server = $node.oriento({
                        host: this.uri.host(),
                        port: this.uri.port(),
                        username: 'root',
                        password: ( $jin.param( 'root' ) || [ process.env.ORIENTDB_ROOT_PASSWORD || 'root' ] )[0]
                    } )
                    return server
                }
            })
        }

        DB( ) {
            return new $jin.prop.vary<any,$jin.db.oriento>({
                owner : this,
                name : 'db',
                pull : prop => {
                    var name = this.uri.path().substring(1)
                    try {
                        $jin.sync.promise( this.Server().get().create({
                            name: name,
                            type: 'document',
                            storage: 'plocal'
                        }) )
                    } catch( error ) {
                        //$jin.log.error( error )
                    }
                    return this.Server().get().use( {
                        name: name,
                        username: this.uri.login(),
                        password: this.uri.password()
                    } )
                }
            })
        }

        serializePlan( plan , prefix = '' ) {
            var chunks = []
            if( plan ) {
                for (var key in plan) {
                    var subPrefix = prefix ? prefix + '.' + key : key
                    var subPlan = this.serializePlan( plan[ key ] , subPrefix )
                    if( subPlan ) chunks.push( subPlan )
                }
            }
            if( !chunks.length && prefix ) {
                chunks.push( prefix + ':0' )
            }
            return chunks.join( ' ' )
        }

        query( ...args ) {
            var query = ''
            for( var i = 0 ; i < args.length ; ++i ) {
                if( i % 2 ) {
                    query += JSON.stringify( args[ i ] )
                } else {
                    query += args[ i ]
                }
            }
            
            return { fetch : fetchPlan => {
                var plan = this.serializePlan( fetchPlan )
                if( $jin.param( 'verbose' ) ) $jin.log.info( 'Query', query , plan )
                var result = $jin.sync.promise( this.DB().get().query( query , { fetchPlan : plan } ) )
                //if( $jin.param( 'verbose' ) ) $jin.log.info( 'Response', result )
                return result
            } }
        }

        Classes( ) {
            return new $jin.prop.vary({
                pull : prop => {
                    var result = $jin.sync.promise( this.DB().get()['class'].list() )
                    var next = {}
                    result.forEach( klass => next[ klass.name ] = klass )
                    return next
                }
            })
        }

        Indexes( ) {
            return new $jin.prop.vary({
                pull : prop => {
                    var result = $jin.sync.promise( this.DB().get().index.list() )
                    var next = {}
                    result.forEach( klass => next[ klass.name ] = klass )
                    //if( $jin.param( 'verbose' ) ) $jin.log.info( 'Indexes', Object.keys( next ) )
                    return next
                }
            })
        }

    }
    
}
