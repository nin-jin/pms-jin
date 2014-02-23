$jin.klass({ '$jin.sample': [ '$jin.dom' ] })

$jin.property({ '$jin.sample.strings': String })

$jin.property({ '$jin.sample.templates': function( ){
	var strings = $jin.sample.strings()
	if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
	return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample.exec': function( type ){
	var pool = $jin.sample.pool( type )
	var sample = pool.pop()
	
	if( !sample ){
		var proto = $jin.sample.proto( type )
		proto.rules()
		var node = proto.nativeNode().cloneNode( true )
		sample = this[ '$jin.dom.exec' ]( node ).proto( proto )
	}
	
	return sample
}})

$jin.atom.prop({ '$jin.sample..view': {
	merge: function( next, prev ){
		if( next === prev ) return prev
		
		if( prev ) prev.sample( this.proto().id(), void 0 )
		
		if( next == null ) $jin.sample.pool( this.proto().id() ).push( this )
		
		return next
	}
}})

$jin.property({ '$jin.sample..covers': null })

$jin.property({ '$jin.sample..proto': function( proto ){
	
	var node = this.nativeNode()
	var rules = proto.rules()
	var sample = this
	var covers = []
	var protoId = proto.id()
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function jin_sample_pull( prev ){
			var view = sample.view()
			if( !view ) return null
			
			return view[ rule.key ]()
		}
		
		var fail = function( error ){
			$jin.log.error( error )
		}
		
		rule.path.forEach( function pathIterator( name ){
			current = current[ name ]
		} )
		
		if( rule.attrName ){
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '/@' + rule.attrName + '=' + rule.key
			,	pull: pull
			,	fail: fail
			,	push: function attrPush( next, prev ){
					if( next == null ) current.removeAttribute( rule.attrName )
					else current.setAttribute( rule.attrName, String( next ) )
				}
			})
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
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '/' + rule.fieldName + '=' + rule.key
			,	pull: pull
			,	fail: fail
			,	push: function fieldPush( next, prev ){
					if( next === void 0 ) return
					if( current[ rule.fieldName ] == next ) return
					current[ rule.fieldName ] = next
				}
			})
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
				if( !handler ) throw new Error( 'View handler in not defined (' + rule.key + ')' )
				
				handler.call( view, $jin.dom.event( event ) )
			})
			sample.entangle( listener )
			return
		} else if( rule.event ){
			var listener = rule.event.listen( current, function eventHandler( event ){
				var view = sample.view()
				if( !view ) return
				
				var handler = view[ rule.key ]
				if( !handler ) throw new Error( 'View handler in not defined (' + rule.key + ')' )
				
				handler.call( view, event )
			})
			sample.entangle( listener )
			return
		} else {
			var cover = $jin.atom(
			{	name: '$jin.sample:' + protoId + '/' + rule.path.join( '/' ) + '=' + rule.key
			,	pull: pull
			,	fail: fail
			, 	merge: function contentPull( nextItems, prevItems ){
					
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
						if( item['$jin.view..element'] ) return item.element()
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
							var node = textNodes.pop()
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
						if( !item['$jin.sample..view'] ) return
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
					
					return nextItems
				}
			} )
		}
		
		sample.entangle( cover )
		
		covers.push( cover )
		
		$jin.atom.bound( function( ){
			cover.pull()
		})
	} )
	
	this.covers( covers )
	
	return proto
}})
