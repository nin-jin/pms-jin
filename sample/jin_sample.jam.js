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
	put: function( next, prev ){
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
	
	return proto
}})
