$jin.klass({ '$jin.sample2': [ '$jin.dom' ] })

$jin.property({ '$jin.sample2.strings': function( next ){
	if( !arguments.length ) return ''
	return $jin.sample2.strings() + next
}})

$jin.property({ '$jin.sample2.templates': function( ){
	var strings = $jin.sample2.strings()
	if( !strings ) throw new Error( 'Please, set up $jin.sample2.strings' )
	return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample2.strings() + '</div>' )
}})

$jin.property.hash({ '$jin.sample2.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample2.exec': function( type ){
	var pool = $jin.sample2.pool( type )
	var sample = pool.shift()
	
	if( !sample ){
		var proto = $jin.sample2.proto( type )
		proto.rules()
		var node = proto.nativeNode().cloneNode( true )
		sample = this[ '$jin.wrapper.exec' ]( node ).proto( proto )
	}
	
	return sample
}})

$jin.atom.prop({ '$jin.sample2..view': {
	push: function( next, prev ){
		if( next === prev ) return prev
		
		if( prev ){
			var protoId = this.proto().id()
			var prevSample = prev.sample( protoId )
			if( prevSample === this ) prev.sample( protoId, void 0 )
		}
		
		if( next == null ){
			var protoId = this.proto().id()
			var pool = $jin.sample2.pool( protoId )
			pool.push( this )
		}
		
		return next
	}
}})

$jin.property.hash({ '$jin.sample2..listeners': { pull: function( ){ return [] } }})

$jin.property({ '$jin.sample2..proto': function( proto ){
	
	var node = this.nativeNode()
	var rules = proto.rules()
	var sample = this
	var protoId = proto.id()
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function jin_sample_pull( ){
			var view = sample.view()
			if( !view ) return null
			
			try {
				return view[ rule.key ]()
			}  catch( error ){
				error.stack = 'Can not get value (' + view.constructor + '..' + rule.key + ')\n' + error.stack
				throw error
			}
		}
		
		rule.path.forEach( function pathIterator( name ){
			current = current[ name ]
		} )
		
		if( rule.attrName ){
			sample.listeners( rule.key ).push( {
				id: $jin.value( $jin.makeid( protoId ) ),
				update: function( ){
					var next = pull()
					if( next == null ) current.removeAttribute( rule.attrName )
					else current.setAttribute( rule.attrName, String( next ) )
				}
			} )
			if( /^(value|checked)$/i.test( rule.attrName ) && /^(select|input|textarea)$/i.test( current.nodeName ) ){
				var handler = function( event ){
					var view = sample.view()
					if( !view ) return
					view[ rule.key ]( current[ rule.attrName ] )
				}
				sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
			}
		} else if( rule.fieldName ){
			sample.listeners( rule.key ).push( {
				id: $jin.value( $jin.makeid( protoId ) ),
				update: function( ){
					var next = pull()
					if( next == null ) return
					current[ rule.fieldName ] = next
				}
			} )
			if( /^(value|checked)$/i.test( rule.fieldName ) && /^(select|input|textarea)$/i.test( current.nodeName ) ){
				var handler = function( event ){
					var view = sample.view()
					if( !view ) return
					view[ rule.key ]( current[ rule.fieldName ] )
				}
				sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
				sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
			}
			if( rule.fieldName === 'scrollTop' ){
				var handler = function( event ){
					var view = sample.view()
					if( !view ) return
					
					view[ rule.key ]( current.scrollTop )
				}
				sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
			}
		} else if( rule.eventName ){
			var listener = $jin.dom( current ).listen( rule.eventName, function eventHandler( event ){
				var view = sample.view()
				if( !view ) return
				
				var handler = view[ rule.key ]
				if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..' + rule.key + ')' )
				
				handler.call( view, $jin.dom.event( event ) )
			})
			sample.entangle( listener )
			return
		} else if( rule.event ){
			var listener = rule.event.listen( current, function eventHandler( event ){
				var view = sample.view()
				if( !view ) return
				
				var handler = view[ rule.key ]
				if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..'  + rule.key + ')' )
				
				handler.call( view, event )
			})
			sample.entangle( listener )
			return
		} else {
			var prevItems
			sample.listeners( rule.key ).push( {
				id: $jin.value( $jin.makeid( protoId ) ),
				update: function( ){
					var nextItems = pull()
					
					if( !prevItems ) prevItems = []
					
					if( nextItems == null ){
						nextItems = [ '' ]
					} else if( typeof nextItems === 'object' ){
						nextItems = [].concat( nextItems )
					} else {
						nextItems = [ String( nextItems ) ]
					}
					
					nextItems = nextItems.filter( function jin_sample_filterNulls( item ){
						return( item != null )
					} )
					
					if( !nextItems.length ) nextItems.push( '' )
					
					nextItems = nextItems.map( function jin_sample_normalizeNext( item ){
						if( typeof item !== 'object' ) return String( item )
						if( item.element ) return item.element()
						return item
					} )
					
					var textNodes = []
					var elements = []
					
					var nodes = current.childNodes
					for( var i = 0; i < nodes.length; ++i ){
						var node = nodes[i]
						if( node.nodeName === '#text' ) textNodes.push( node )
						else elements.push( node )
					}
					
					var nextNodes = nextItems.map( function jin_sample_generateNodes( item ){
						if( typeof item === 'string' ){
							var node = textNodes.shift()
							if( !node ) node = document.createTextNode( item )
							else if( node.nodeValue !== item ) node.nodeValue = item
							return node
						} else {
							var node = item[ '$jin.dom..nativeNode' ] ? item.nativeNode() : item
							var index = elements.indexOf( node )
							if( index >= 0 ) elements[ index ]  = null
							return node
						}
					} )
					
					var removeNode = function jin_sample_removeNode( node ){
						if( !node ) return
						current.removeChild( node )
					}
					
					elements.forEach( removeNode )
					textNodes.forEach( removeNode )
					
					prevItems.map( function jin_sample_freePrevs( item ){
						if( typeof item === 'string' ) return
						if( !item['$jin.sample2..view'] ) return
						if( nextItems.indexOf( item ) >= 0 ) return
						item.view( null )
					} )
					
					for( var i = nextNodes.length; i > 0; --i ){
						var next = nextNodes[ i ]
						var node = nextNodes[ i - 1 ]
						if( next ){
							if( node.nextNode !== next ) current.insertBefore( node, next )
						} else {
							if( node.parentNode !== current ) current.appendChild( node )
						}
					}
					
					prevItems = nextItems
				}
			} )
		}
		
	} )
	
	return proto
}})
