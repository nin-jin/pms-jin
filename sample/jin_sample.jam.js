$jin.klass({ '$jin.sample': [ '$jin.dom' ] })
$jin.klass({ '$jin.sample.proto': [ '$jin.registry' ] })

$jin.property({ '$jin.sample.strings': String })

$jin.property({ '$jin.sample.templates': function( ){
	var strings = $jin.sample.strings()
	if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
	return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
}})

$jin.property({ '$jin.sample.proto..nativeNode': function( ){
	var selector = '[' + this.id() + ']'
	
	var node = $jin.sample.templates().cssFind( selector )
	if( !node ) throw new Error( 'Sample not found (' + selector + ')' )
	
	return node.raw()
}})

$jin.property({ '$jin.sample.proto..rules': function( ){
	var node = this.nativeNode()
	
	var path = []
	var rules = []
	
	function collect( node ){
		
		if( node.childNodes ){
			for( var i = 0; i < node.childNodes.length; ++i ){
				var child = node.childNodes[i]
				
				if( child.nodeName === '#text' ){
					var found = /\{(\w+)\}/g.exec( child.nodeValue )
					if( !found ) continue
					
					var key = found[1]
					rules.push({ key: key, path: path.slice() })
					
					while( node.firstChild ) node.removeChild( node.firstChild )
					break;
				} else {
					path.push( 'childNodes', i )
						collect( child )
					path.pop(); path.pop()
				}
			}
		}
		
		var attrs = node.attributes
		if( attrs ){
			for( var i = 0; i < attrs.length; ++i ){
				var attr = attrs[ i ]
				
				var found = /^\{(\w+)\}$/g.exec( attr.nodeValue )
				if( !found ) continue
				var key = found[1]
				
				rules.push({ key: key, path: path.slice(), attrName: attr.nodeName })
			}
			
			var props = node.getAttribute( 'jin-sample-props' )
			if( props ){
				props.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var subPath = chunk.split( /[-_:=.]/g )
					var key = subPath.pop()
					var fieldName = subPath.pop()
					
					rules.push({ key: key, path: path.concat( subPath ), fieldName: fieldName })
				} )
			}
			
			var events = node.getAttribute( 'jin-sample-events' )
			if( events ){
				events.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var eventName = chunk.split( /[-_:=.]/g )
					var key = eventName.pop()
					eventName = eventName.join( '.' )
					
					var shortFound = /^(on)(\w+)$/.exec( eventName )
					if( shortFound ){
						var type = shortFound[1]
						var name = shortFound[2]
						rules.push({ key: key, path: path.slice(), eventName: name })
					} else {
						var event = $jin.glob( eventName )
						if( !event ) throw new Error( 'Unknown event [' + eventName + ']' )
						rules.push({ key: key, path: path.slice(), event: event })
					}
				} )
			}
			
		}
	}
	
	collect( node )
	
	return rules
}})

$jin.atom.prop({ '$jin.sample..view': {
	put: function( next, prev ){
		if( next == null ) $jin.sample.pool( this.proto().id() ).push( this )
		return next
	}
}})

$jin.property({ '$jin.sample..covers': null })

$jin.method({ '$jin.sample.proto..make': function( view ){
	var pool = $jin.sample.pool( this.id() )
	var sample = pool.pop()
	if( !sample ){
		var rules = this.rules()
		var node = this.nativeNode().cloneNode( true )
		sample = $jin.sample( node ).proto( this ).rules( rules )
	}
	sample.view( view )
	return sample
}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample..free': function( ){
	//this.view( null )
}})

$jin.property({ '$jin.sample..proto': null })

$jin.method({ '$jin.sample..rules': function( rules ){
	if( !arguments.length ) throw new Error( 'Rules is not getter' )
	
	var node = this.nativeNode()
	var sample = this
	var covers = []
	var protoId = this.proto().id()
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function( prev ){
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
			, 	merge: function contentPull( n, p ){
					var next = n
					var prev = p
					
					if( !prev ) prev = []
					
					if( next == null ){
						next = []
					} else if( typeof next !== 'object' ){
						next = [ String( next ) ]
					} else {
						next = [].concat( next )
					}
					
					next = next.filter( function( item ){
						return ( item != null )&&( item !== '' )
					} )
					next = next.map( function( item ){
						return ( typeof item === 'object' ) ? item : String( item )
					} )
					
					var prevKeys = []
					prev = prev.filter( function( item ){
						var key = ( item.nodeName === '#text' ) ? item.nodeValue : item
						
						var nextIndex = next.indexOf( key )
						if( nextIndex >= 0 ){
							prevKeys.push( key )
							return true
						}
						
						if( typeof item.nativeNode === 'function' ) var itemNode = item.nativeNode()
						else var itemNode = item
						
						if( itemNode.parentNode === current ){
							current.removeChild( itemNode )
							if( typeof item.freezed === 'function' ) item.freezed( true )
						}
						
						return false
					} )
					
					next = next.map( function( item, index ){
						if( item === prevKeys[ index ] ) return prev[ index ]
						
						if( typeof item === 'string' ) item = document.createTextNode( item )
						
						if( typeof item.freezed === 'function' ) item.freezed( false )
						
						var node = ( typeof item.nativeNode === 'function' ) ? item.nativeNode() : item
						
						var prevItem = prev[ index ]
						
						if( prevItem && ( typeof prevItem.nativeNode === 'function' ) ) prevItem = prevItem.nativeNode()
						
						current.insertBefore( node, prevItem || null )
						
						return item
					} )
					
					return next
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
	
	return this
}})
