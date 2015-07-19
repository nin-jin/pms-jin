module $jin.view {
    
    export class sample < OwnerType extends $jin.view.model<any> >
    extends $jin.model < OwnerType > {

        static objectId = $jin.model.classRegister( '$jin.view.sample' , '$jin.model' )

        static attach( el : Element , view ) {
            var sampleClass = $jin.view[ view['constructor'].objectId ]
            var sample = new sampleClass({
                owner: view,
                view: view,
                name: view.name
            })
            sample.render( el )
            return sample
        }

        //view : $jin.view.model
        name : string
        param : any
        view : any

        tagName() {
            return 'div'
        }

        attributes() {
            return { /*id : () => this.objectId*/ }
        }

        fields() {
            return {}
        }

        childNodes() {
            return []
        }
        
        constructor( config : {
            owner : OwnerType
            view : any
            name? : string
            param? : any
        }) {
            var name = config.name
            if( config.param !== void 0 ) name += '_' + config.param
            super({ owner : config.owner , name : name })

            this.param = config.param
            this.view = config.view
        }

        render( root ) {
            if( root ) this.Node().set( root )
            else root = this.Node().get()
            this.Version().pull()
            return root
        }

        Node( ) {
            return new $jin.prop.vary<Element,sample<OwnerType>>({
                owner : this,
                name : 'node',
                pull : prop => {
                    return document.createElement( this.tagName() )
                },
                notify : ( prop , next ) => {
                    next.setAttribute( 'id' , this.objectId )
                    next['jin_sample'] = this
                    //atom.owner.version.pull()
                }
            })
        }
        
        Version( ) {
            return new $jin.atom.prop<number,sample<OwnerType>>({
                owner : this,
                name : 'version',
                value : 0,
                pull : ( atom , prev ) => {
                    var root = atom.owner.Node().get()

                    var attrs = atom.owner.attributes()
                    if( attrs ) for( var name in attrs ) {
                        root.setAttribute( name , attrs[ name ].get() )
                    }

                    var fields = atom.owner.fields()
                    if( fields ) for( var name in fields ) {
                        root[ name ] = fields[ name ].get()
                        if( name === 'value' ) {
                            root.addEventListener( 'input' , ( name => () => {
                                fields[ name ].set( root['value'] )
                            })(name) , false )
                        }
                        if( name === 'checked' ) {
                            root.addEventListener( 'click' , ( name => () => {
                                fields[ name ].set( root['checked'] )
                            })( name ) , false )
                        }
                    }

                    var childNodes = root.childNodes
                    var idMap = {}
                    for( var i = 0 ; i < childNodes.length ; ++i ) {
                        var child = <HTMLElement>childNodes[i]
                        if( !child.id ) continue
                        idMap[ child.id ] = child
                    }

                    var childSamples = [].concat.apply( [] , atom.owner.childNodes() )
                    for( var i = 0 ; i < childSamples.length ; ++i ) {
                        var nextNode = childNodes[i]
                        var sample = childSamples[i]

                        if( typeof sample === 'object' ) {
                            var sampleClass = $jin.view[ sample['constructor'].objectId ]
                            if(!( sample instanceof sampleClass )) {
                                sample = new sampleClass({
                                    owner: sample,
                                    view: sample,
                                    name: sample.name
                                })
                            }

                            var existsNode = idMap[ sample.objectId ]

                            existsNode = sample.render( existsNode )

                            if( nextNode !== existsNode ) root.insertBefore( existsNode , nextNode )
                        } else {
                            if( nextNode && nextNode.nodeName === '#text' ) {
                                nextNode.nodeValue = String(sample)
                            } else {
                                var textNode = document.createTextNode(String(sample))
                                root.insertBefore(textNode, nextNode)
                            }
                        }
                    }

                    while( nextNode = childNodes[i] ) {
                        root.removeChild( nextNode )
                    }

                    return prev + 1
                },
                fail: ( atom , error ) => {
                    $jin.log.error( error )
                }
            })
        }

    }
    
}

/*get rootNode( ) {
 return new $jin.prop.vary({
 owner : this ,
 name : '_rootNode' ,
 pull : prev => {
 var next = document.createElement( 'div' )
 next.setAttribute( 'id' , this.objectPath )
 new $jin.atom.prop({
 owner : this ,
 name : '_rootNode_content' ,
 pull : prev => this.message.get() ,
 notify : next => {
 var root = this.rootNode.get()
 for( var child ; child = root.firstChild ; ) root.removeChild( child )
 if( next ) root.appendChild( next )
 }
 })
 return next
 }
 })
 }

 get message( ) {
 return new $jin.prop.proxy({
 pull : () => document.createTextNode( 'Hello' )
 })
 }*/
        
