$jin.klass({ '$jin.dom': [ '$jin.wrapper' ] })

$jin.method( '$jin.wrapper.exec', '$jin.dom.exec', function( node ){
    if( node instanceof this ) return node
    
    //var name = String( this )
    //var obj = node[ name ]
    //if( obj && ( obj instanceof this ) ) return obj
    
    var obj = new this([ node ])
    
    //try {
    //    obj.nativeNode()[ name ] = this
    //} catch( e ){}
    
    return obj
} )

$jin.method( '$jin.dom.env', function( ){
    return $jin.env()
} )

$jin.method( '$jin.dom.escape', function( val ){
    return val.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&apos;' )
} )

$jin.method( '$jin.dom.decode', function( text ){
	var decoder = document.createElement( 'textarea' )
	decoder.innerHTML = text
	return decoder.value
} )

$jin.method( '$jin.dom.html2text', function( html ){
	return $jin.dom.decode(
		String( html )
		.replace( /<div><br[^>]*>/gi, '\n' )
		.replace( /<br[^>]*>/gi, '\n' )
		.replace( /<div>/gi, '\n' )
		.replace( /<[^<>]+>/g, '' )
	)
} )


$jin.method( '$jin.wrapper..init', '$jin.dom..init', function( node ){
    if( typeof node === 'string' ){
		if( $jin.dom.env().DOMParser ){
			var parser = new( $jin.dom.env().DOMParser )
			var doc = parser.parseFromString( '<body>' + node + '</body>', 'application/xhtml+xml' )
			doc = doc.documentElement || doc
		} else {
			var doc = document.createElement( 'div' )
			doc.innerHTML = node
			//var doc= new ActiveXObject( 'MSXML2.DOMDocument' )
			//doc.async= false
			//doc.loadXML( node )
		}
		
		if( doc.childNodes.length > 1 ){
			node = document.createDocumentFragment()
			var cur; while( cur = doc.firstChild ) node.appendChild( cur )
		} else {
			node = doc.firstChild
		}
		
	    this.nativeNode( node )
		
		var errorNode = doc.getElementsByTagName( 'parsererror' )[0]
		if( errorNode ) throw new Error( this.text() )
		
		return this
    } else {
        if( typeof node.raw === 'function' ) node = node.raw()
	    this.nativeNode( node )
		return this
    }
} )

$jin.alias( '$jin.wrapper..raw', '$jin.dom..raw', 'nativeNode' )
$jin.property( '$jin.dom..nativeNode', null )
    
$jin.method( '$jin.dom..nativeDoc', function( ){
    var node = this.raw()
    return node.ownerDocument || node
} )
    
$jin.method( '$jin.dom..toString', function( ){
    var serializer = new( $jin.dom.env().XMLSerializer )
    return serializer.serializeToString( this.nativeNode() )
} )
    
$jin.method( '$jin.dom..transform', function( stylesheet ){
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( $jin.dom( stylesheet ).nativeDoc() )
    var doc= proc.transformToDocument( this.nativeNode() )
    return $jin.dom( doc )
} )
    
$jin.method( '$jin.dom..render', function( from, to ){
    from= $jin.dom( from ).nativeNode()
    to= $jin.dom( to ).nativeNode()
    
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( this.nativeDoc() )
    var res= proc.transformToFragment( from, to.ownerDocument )
    to.innerHTML= ''
    to.appendChild( res )
    
    return this
} )
    
$jin.method( '$jin.dom..name', function( ){
    return this.nativeNode().nodeName
} )

$jin.method( '$jin.dom..attr', function( name, value ){
    if( arguments.length > 1 ){
        if( value == null ) this.nativeNode().removeAttribute( name )
        else this.nativeNode().setAttribute( name, value )
        return this
    } else {
        return this.nativeNode().getAttribute( name )
    }
} )
    
$jin.method( '$jin.dom..attrList', function( ){
    var nodes= this.nativeNode().attributes
    
    if( !nodes ) return []
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( '$jin.dom..text', function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.textContent = String( value )
        return this
    } else {
        return node.textContent
    }
} )

$jin.method( '$jin.dom..clear', function( ){
    var node = this.nativeNode()
    var child
    while( child= node.firstChild ){
        node.removeChild( child )
    }
    return this
} )

$jin.method( '$jin.dom..parent', function( parent ){
    var node = this.nativeNode()
    if( arguments.length ){
        if( parent == null ){
            parent= node.parentNode
            if( parent ) parent.removeChild( node )
        } else {
            $jin.dom( parent ).nativeNode().appendChild( node )
        }
        return this
    } else {
        parent= node.parentNode || node.ownerElement
        return parent ? $jin.dom( parent ) : parent
    }
} )

$jin.method( '$jin.dom..next', function( next ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var next = node.nextSibling
        if( next ) next = $jin.dom( next )
        return next
    }
    throw new Error( 'Not implemented' )
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node.nextSibling )
    return this
} )

$jin.method( '$jin.dom..prev', function( prev ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var prev = node.previousSibling
        if( prev ) prev = $jin.dom( prev )
        return prev
    }
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node )
    return this
} )

$jin.method( '$jin.dom..head', function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.firstChild
        if( node ) node = $jin.dom( node )
        return node
    }
    node.insertBefore( $jin.dom( dom ).nativeNode(), this.head().nativeNode() )
    return this
} )

$jin.method( '$jin.dom..tail', function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.lastChild
        if( node ) node = $jin.dom( node )
        return node
    }
    $jin.dom( dom ).parent( this )
    return this
} )

$jin.method( '$jin.dom..follow', function( ){
	var node = this
	while( true ){
		var next = node.next()
		if( next ) return next
		node = node.parent()
		if( !node ) return null
	}
} )

$jin.method( '$jin.dom..precede', function( ){
	var dom = this
	while( true ){
		var next = node.prev()
		if( next ) return next
		dom = dom.parent()
		if( !dom ) return null
	}
} )

$jin.method( '$jin.dom..delve', function( ){
	return this.head() || this.follow()
} )

$jin.method( '$jin.dom..childList', function( ){
    var nodes= this.nativeNode().childNodes
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
} )

$jin.method( '$jin.dom..xpathFind', function( xpath ){
    var node= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null ).iterateNext()
    if( !node ) return node
    return $jin.dom( node )
} )

$jin.method( '$jin.dom..xpathSelect', function( xpath ){
    var list= []
    
    var found= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null )
    for( var node; node= found.iterateNext(); ) list.push( $jin.dom( node ) )
    
    return list
} )

$jin.method( '$jin.dom..cssFind', function( css ){
    var node = this.nativeNode().querySelector( css )
    if( !node ) return node
    return $jin.dom( node )
} )

$jin.method( '$jin.dom..cssSelect', function( css ){
    return [].slice.call( this.nativeNode().querySelectorAll( css ) ).map( $jin.dom )
} )

$jin.method( '$jin.dom..clone', function( ){
    return $jin.dom( this.nativeNode().cloneNode() )
} )

$jin.method( '$jin.dom..cloneTree', function( ){
    return $jin.dom( this.nativeNode().cloneNode( true ) )
} )


$jin.method( '$jin.dom..makeText', function( value ){
    return $jin.dom( this.nativeDoc().createTextNode( value ) )
} )

$jin.method( '$jin.dom..makeFragment', function( ){
    return $jin.dom( this.nativeDoc().createDocumentFragment() )
} )

$jin.method( '$jin.dom..makePI', function( name, content ){
    return $jin.dom( this.nativeDoc().createProcessingInstruction( name, content ) )
} )

$jin.method( '$jin.dom..makeElement', function( name, ns ){
    if( arguments.length > 1 ){
        return $jin.dom( this.nativeDoc().createElementNS( ns, name ) )
    } else {
        return $jin.dom( this.nativeDoc().createElement( name ) )
    }
} )

$jin.method( '$jin.dom..makeTree', function( json ){
    if( !json ) return this.makeFragment()
    if( ~[ 'string', 'number' ].indexOf( typeof json ) ) return this.makeText( json )
    
    var result = this.makeFragment()
    for( var key in json ){
        if( !json.hasOwnProperty( key ) ) continue
        
        var val = json[ key ]
        if( !key || Number( key ) == key ){
            this.makeTree( val ).parent( result )
        } else {
            var dom = this.makeElement( key )
            this.makeTree( val ).parent( dom )
            dom.parent( result )
        }
    }
    return result
} )

$jin.method( '$jin.dom..listen', function( eventName, handler ){
	handler = $jin.defer.callback( handler )
    this.nativeNode().addEventListener( eventName, handler, false )
    return $jin.listener().crier( this ).eventName( eventName ).handler( handler )
} )

$jin.method( '$jin.dom..forget', function( eventName, handler ){
    this.nativeNode().removeEventListener( eventName, handler, false )
    return this
} )

$jin.method( '$jin.dom..scream', function( event ){
    event = $jin.dom.event( event )
    this.nativeNode().dispatchEvent( event.nativeEvent() )
    return this
} )

$jin.method( '$jin.dom..flexShrink', function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.style.flexShrink = String( value )
        return this
    } else {
        return document.getComputedStyles( node ).flexShrink
    }
} )

$jin.method( '$jin.dom..normalize', function( map ){
    var node = this.nativeNode()
	
	var childs = []
	for( var i = 0; i < node.childNodes.length; ++i ){
		childs.push( node.childNodes[ i ] )
	}
	
	childs.forEach( function normalizeChild( child ){
		var name = child.nodeName
		var handler = map[ name ] || map[ '' ]
		if( handler ){
			var newChild = handler.call( map, child )
			if( newChild === child ) return
		}
		if( newChild ){
			if( newChild.nodeName ) newChild = [ newChild ]
			for( var i = 0; i < newChild.length; ++i ){
				node.insertBefore( newChild[i], child )
			}
		}
		node.removeChild( child )
	} )
	
	return this
} )

$jin.method( '$jin.dom..rangeAround', function( ){
	return $jin.dom.range.create().aimNode( this )
} )

$jin.method( '$jin.dom..rangeContent', function( ){
	return $jin.dom.range.create().aimNodeContent( this )
} )
