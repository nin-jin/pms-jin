module $jin.ball {

    export function parse( str : String ){
        var root = new $jin.ball.node;
        var stack = [ root ];
        str.split( '\n' ).forEach(( row ) => {
            var indent = row.replace( /[^\s].*/, '' );
            if( indent.length >= row.length ) return;
            stack = stack.slice( 0, indent.length + 1 );
            var pair = row.substring( indent.length ).split( /\s+=/, 2 );
            var names = pair[0].split( /\s+/ );
            var value = pair[1] || '';
            var lastNode = stack[ stack.length - 1 ];
            names.forEach(( name ) => {
                lastNode.list.push( lastNode = new $jin.ball.node( name ) );
            });
            if( value ) lastNode.list.push( new $jin.ball.node( '', value ) );
            stack.push( lastNode );
        });
        return root;
    }
    
    export function make( name, config : { [index : string ] : $jin.ball.node[] } ){
        var list = [];
        for( var key in config ){
            list.push( new $jin.ball.node( key, '', config[ key ] ) );
        }
        return new $jin.ball.node( name, '', list );
    }
    
    export class node {
        name : string = '';
        value : string = '';
        list : $jin.ball.node[] = [];
        
        constructor( name? : string, value? : string, list? : $jin.ball.node[] ){
            if( name ) this.name = name;
            if( value ) this.value = value;
            if( list ) this.list = list.slice( 0 );
        }
        
        execute( context : $jin.ball.node ){
            if( this.name ) {
                var handler = context.select([ this.name, 0, 0 ]);
                if (handler) {
                    return handler.execute($jin.ball.make('', { '': [ context ], '[tree]': [ this ] }));
                }
            }
            var list = this.list.map( item => item.execute( context ) ).filter( item => item );
            return new $jin.ball.node( this.name, this.value, list );
        }
        
        select( args : any[] ) : $jin.ball.node {
            var selector = args[0];
            switch( typeof selector ){
                case 'string' :
                    var list = this.list.filter( item => item.name === selector );
                    if( !list.length ) {
                        var protos = this.list.filter(item => item.name === '');
                        for( var i = 0; i < protos.length; ++i ){
                            var node : $jin.ball.node = protos[i].select( args );
                            if( node ) break;
                        }
                        if( node ) list = node.list;
                    }
                    var node : $jin.ball.node = new $jin.ball.node( '', '', list );
                    break;
                case 'number' :
                    var node : $jin.ball.node = this.list[ selector ];
                    break;
                default :
                    throw new Error( 'Wrong type of parameter' );
            }
            if( !node ) return node;
            if( args.length < 2 ) return node;
            return node.select( args.slice( 1 ) );
        }
        
        values( ){
            return this.list.filter( child => !child.name ).map( child => child.value );
        }

        rows( ){
            var rows : string[] = [];
            
            this.list.forEach(( child ) => {
                if( child.value ){
                    rows.push( '=' + child.value );
                } else {
                    rows = rows.concat( child.rows().values() );
                }
            });

            if( this.name ){
                if( this.list.length > 1 ){
                    rows = rows.map(( row ) => {
                        return '\t' + row;
                    });
                    rows.unshift( this.name );
                } else if( this.list.length > 0 ){
                    rows[ 0 ] = this.name + ' ' + rows[ 0 ];
                } else {
                    rows[ 0 ] = this.name;
                }
            }
            
            var nodes = rows.map(( row ) => new $jin.ball.node( '', row ) );
            
            return new $jin.ball.node( '', '', nodes ); 
        }
        
        toString( ){
            return this.values().join( '\n' );
        }
        
//        toString( prefix = '' ){
//            var res = prefix + this.name;
//            if( this.value ) res += '=' + this.value;
//            if( this.name ) prefix += '\t';
//            var chunks = this.list.map((child) => {
//                return child.toString( prefix );
//            })
//            res += '\n' + chunks.join( '\n' );
//            return res;
//        }
    }
    
//    class nodeDefine extends $jin.ball.node {
//        execute( context : $jin.ball.node ){
//            var arg = context.select([ '[tree]', 0, 0 ]);
//            if( !arg ) throw new Error( 'Need a parameter' );
//            var target = new $jin.ball.node( '', '', arg.list );
//            context.put( name, target );
//            return null;
//        }
//    }


    export class nodeFunc extends $jin.ball.node {
        constructor( name: string, execute : ( context : $jin.ball.node ) => $jin.ball.node ){
            super( '', name );
            this.execute = execute;
        }
    }
    
    export var baseContext = $jin.ball.make( '', {
        '#' : [ new $jin.ball.nodeFunc( '[$jin.ball.node.remark]', context => null ) ],
        '<' : [ new $jin.ball.nodeFunc( '[$jin.ball.node.assign]', context => {
            console.log( context.list[0].rows().toString())
            return new $jin.ball.node( '', context.select([ '[tree]', 0, 0 ]).name );
        } ) ],
        'concat' : [ new $jin.ball.nodeFunc( '[$jin.ball.node.concat]', context => {
            var tree = context.select([ '[tree]', 0, 0 ]);
            var list = tree.list
            .map( item => {
                var res = item.execute( context );
                if( res.name !== 'string' ) throw new Error( 'Can not concat [' + res.name + ']' );
                return res.select([ 0 ]);
            } );
            var str = list.map( str => str.value ).join( '' );  
            return new $jin.ball.node( 'string', '', [ new $jin.ball.node( '', str ) ] );
        } ) ]
    } );
    
}
