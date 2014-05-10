/**
 * @name $jin.dom
 * @class $jin.dom
 * @returns $jin.dom
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.dom': [ '$jin.wrapper' ] })

//$jin.method( '$jin.wrapper.exec', '$jin.wrapper.exec', function( node ){
//    if( node instanceof this ) return node
//    
//    //var name = String( this )
//    //var obj = node[ name ]
//    //if( obj && ( obj instanceof this ) ) return obj
//    
//    var obj = new this([ node ])
//    
//    //try {
//    //    obj.nativeNode()[ name ] = this
//    //} catch( e ){}
//    
//    return obj
//} )

/**
 * @name $jin.dom.env
 * @method env
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.env': function( ){
    return $jin.env()
}})

/**
 * @name $jin.dom.escape
 * @method escape
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.escape': function( val ){
    return val.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&apos;' )
}})

/**
 * @name $jin.dom.decode
 * @method decode
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.decode': function( text ){
	var decoder = document.createElement( 'textarea' )
	decoder.innerHTML = text
	return decoder.value
}})

/**
 * @name $jin.dom.html2text
 * @method html2text
 * @static
 * @member $jin.dom
 */
$jin.method({ '$jin.dom.html2text': function( html ){
	return $jin.dom.decode(
		String( html )
		.replace( /<div><br[^>]*>/gi, '\n' )
		.replace( /<br[^>]*>/gi, '\n' )
		.replace( /<div>/gi, '\n' )
		.replace( /<[^<>]+>/g, '' )
	)
}})

/**
 * @name $jin.dom#init
 * @method init
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..init': function( node ){
    '$jin.wrapper..init'
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
}})

$jin.alias( '$jin.wrapper..raw', '$jin.dom..raw', 'nativeNode' )
/**
 * @name $jin.dom#nativeNode
 * @method nativeNode
 * @member $jin.dom
 */
$jin.property({ '$jin.dom..nativeNode': null })
    
/**
 * @name $jin.dom#nativeDoc
 * @method nativeDoc
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..nativeDoc': function( ){
    var node = this.raw()
    return node.ownerDocument || node
}})
    
/**
 * @name $jin.dom#toString
 * @method toString
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..toString': function( ){
    var serializer = new( $jin.dom.env().XMLSerializer )
    return serializer.serializeToString( this.nativeNode() )
}})
    
/**
 * @name $jin.dom#transform
 * @method transform
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..transform': function( stylesheet ){
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( $jin.dom( stylesheet ).nativeDoc() )
    var doc= proc.transformToDocument( this.nativeNode() )
    return $jin.dom( doc )
}})
    
/**
 * @name $jin.dom#render
 * @method render
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..render': function( from, to ){
    from= $jin.dom( from ).nativeNode()
    to= $jin.dom( to ).nativeNode()
    
    var proc= new( $jin.dom.env().XSLTProcessor )
    proc.importStylesheet( this.nativeDoc() )
    var res= proc.transformToFragment( from, to.ownerDocument )
    to.innerHTML= ''
    to.appendChild( res )
    
    return this
}})
    
/**
 * @name $jin.dom#name
 * @method name
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..name': function( ){
    return this.nativeNode().nodeName
}})

/**
 * @name $jin.dom#attr
 * @method attr
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..attr': function( name, value ){
    if( arguments.length > 1 ){
        if( value == null ) this.nativeNode().removeAttribute( name )
        else this.nativeNode().setAttribute( name, value )
        return this
    } else {
        return this.nativeNode().getAttribute( name )
    }
}})
    
/**
 * @name $jin.dom#attrList
 * @method attrList
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..attrList': function( ){
    var nodes= this.nativeNode().attributes
    
    if( !nodes ) return []
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
}})

/**
 * @name $jin.dom#text
 * @method text
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..text': function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.textContent = String( value )
        return this
    } else {
        return node.textContent
    }
}})

/**
 * @name $jin.dom#clear
 * @method clear
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..clear': function( ){
    var node = this.nativeNode()
    var child
    while( child= node.firstChild ){
        node.removeChild( child )
    }
    return this
}})

/**
 * @name $jin.dom#parent
 * @method parent
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..parent': function( parent ){
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
}})

/**
 * @name $jin.dom#next
 * @method next
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..next': function( next ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var next = node.nextSibling
        if( next ) next = $jin.dom( next )
        return next
    }
    throw new Error( 'Not implemented' )
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node.nextSibling )
    return this
}})

/**
 * @name $jin.dom#prev
 * @method prev
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..prev': function( prev ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var prev = node.previousSibling
        if( prev ) prev = $jin.dom( prev )
        return prev
    }
    this.parent().nativeNode().insertBefore( $jin.dom( prev ).nativeNode(), node )
    return this
}})

/**
 * @name $jin.dom#head
 * @method head
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..head': function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.firstChild
        if( node ) node = $jin.dom( node )
        return node
    }
    node.insertBefore( $jin.dom( dom ).nativeNode(), this.head().nativeNode() )
    return this
}})

/**
 * @name $jin.dom#tail
 * @method tail
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..tail': function( dom ){
    var node = this.nativeNode()
    if( !arguments.length ){
        var node = node.lastChild
        if( node ) node = $jin.dom( node )
        return node
    }
    $jin.dom( dom ).parent( this )
    return this
}})

/**
 * @name $jin.dom#follow
 * @method follow
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..follow': function( ){
	var node = this
	while( true ){
		var next = node.next()
		if( next ) return next
		node = node.parent()
		if( !node ) return null
	}
}})

/**
 * @name $jin.dom#precede
 * @method precede
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..precede': function( ){
	var dom = this
	while( true ){
		var next = node.prev()
		if( next ) return next
		dom = dom.parent()
		if( !dom ) return null
	}
}})

/**
 * @name $jin.dom#delve
 * @method delve
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..delve': function( ){
	return this.head() || this.follow()
}})

/**
 * @name $jin.dom#childList
 * @method childList
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..childList': function( ){
    var nodes= this.nativeNode().childNodes
    
    var list= []
    for( var i= 0; i < nodes.length; ++i ){
        list.push( $jin.dom( nodes[ i ] ) )
    }
    
    return list
}})

/**
 * @name $jin.dom#xpathFind
 * @method xpathFind
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..xpathFind': function( xpath ){
    var node= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null ).iterateNext()
    if( !node ) return node
    return $jin.dom( node )
}})

/**
 * @name $jin.dom#xpathSelect
 * @method xpathSelect
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..xpathSelect': function( xpath ){
    var list= []
    
    var found= this.nativeDoc().evaluate( xpath, this.nativeNode(), null, null, null )
    for( var node; node= found.iterateNext(); ) list.push( $jin.dom( node ) )
    
    return list
}})

/**
 * @name $jin.dom#cssFind
 * @method cssFind
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cssFind': function( css ){
    var node = this.nativeNode().querySelector( css )
    if( !node ) return node
    return $jin.dom( node )
}})

/**
 * @name $jin.dom#cssSelect
 * @method cssSelect
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cssSelect': function( css ){
    return [].slice.call( this.nativeNode().querySelectorAll( css ) ).map( $jin.dom )
}})

/**
 * @name $jin.dom#clone
 * @method clone
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..clone': function( ){
    return $jin.dom( this.nativeNode().cloneNode() )
}})

/**
 * @name $jin.dom#cloneTree
 * @method cloneTree
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..cloneTree': function( ){
    return $jin.dom( this.nativeNode().cloneNode( true ) )
}})


/**
 * @name $jin.dom#makeText
 * @method makeText
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeText': function( value ){
    return $jin.dom( this.nativeDoc().createTextNode( value ) )
}})

/**
 * @name $jin.dom#makeFragment
 * @method makeFragment
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeFragment': function( ){
    return $jin.dom( this.nativeDoc().createDocumentFragment() )
}})

/**
 * @name $jin.dom#makePI
 * @method makePI
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makePI': function( name, content ){
    return $jin.dom( this.nativeDoc().createProcessingInstruction( name, content ) )
}})

/**
 * @name $jin.dom#makeElement
 * @method makeElement
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeElement': function( name, ns ){
    if( arguments.length > 1 ){
        return $jin.dom( this.nativeDoc().createElementNS( ns, name ) )
    } else {
        return $jin.dom( this.nativeDoc().createElement( name ) )
    }
}})

/**
 * @name $jin.dom#makeTree
 * @method makeTree
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..makeTree': function( json ){
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
}})

/**
 * @name $jin.dom#listen
 * @method listen
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..listen': function( eventName, handler ){
	handler = $jin.defer.callback( handler )
    this.nativeNode().addEventListener( eventName, handler, false )
    return $jin.listener().crier( this ).eventName( eventName ).handler( handler )
}})

/**
 * @name $jin.dom#forget
 * @method forget
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..forget': function( eventName, handler ){
    this.nativeNode().removeEventListener( eventName, handler, false )
    return this
}})

/**
 * @name $jin.dom#scream
 * @method scream
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..scream': function( event ){
    event = $jin.dom.event( event )
    this.nativeNode().dispatchEvent( event.nativeEvent() )
    return this
}})

/**
 * @name $jin.dom#flexShrink
 * @method flexShrink
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..flexShrink': function( value ){
    var node = this.nativeNode()
    if( arguments.length ){
        node.style.flexShrink = String( value )
        return this
    } else {
        return document.getComputedStyles( node ).flexShrink
    }
}})

/**
 * @name $jin.dom#normalize
 * @method normalize
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..normalize': function( map ){
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
}})

/**
 * @name $jin.dom#rangeAround
 * @method rangeAround
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..rangeAround': function( ){
	return $jin.dom.range.create().aimNode( this )
}})

/**
 * @name $jin.dom#rangeContent
 * @method rangeContent
 * @member $jin.dom
 */
$jin.method({ '$jin.dom..rangeContent': function( ){
	return $jin.dom.range.create().aimNodeContent( this )
}})
