module $jin.view {
    
    export class sample extends $jin.object {
        
        get rootNode( ) {
            var node = document.createElement( 'div' )
            node.setAttribute( 'id' , this.objectPath )
            node.appendChild( this.contentNode )
            return node
        }
        
        get contentNode( ) {
            return document.createTextNode( 'Hello' )
        }
        
    }
    
}

var vvv = new $jin.view.sample()
document.body.appendChild( vvv.rootNode )
