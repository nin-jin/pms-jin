module $jin.db {
    
    export class oriento {
        
        uri : any
        
        constructor( uri ) {
            this.uri = $jin.uri.parse( uri )
        }
        
        get driver( ) {
            return new $jin.prop.vary({
                owner : this,
                name : '_driver',
                pull : () => {
                    var node = $node.oriento({
                        host: this.uri.host(),
                        port: this.uri.port(),
                        username: 'root',
                        password: $jin.param( 'root' )[0]
                    } )
                    var db = node.use({
                        name : this.uri.path().substring( 1 ),
                        username: 'admin',
                        password: $jin.param( 'admin' )[0]
                    })
                    return db
                }
            })
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
            
            return { fetch : $jin.async2sync( ( fetchPlan , done ) => {
                if( $jin.param( 'verbose' ) ) $jin.log.info( 'Query', query )
                this.driver.get().query( query , { fetchPlan : fetchPlan } ).then( result => {
                    if( $jin.param( 'verbose' ) ) $jin.log.info( 'Response', result )
                    done( null, result )
                }, error => {
                    $jin.log.error( 'Error', error )
                    done( error )
                } )
            } ) }
        }
        
    }
    
}