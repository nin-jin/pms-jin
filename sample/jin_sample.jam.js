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
				} else {
					path.push( 'childNodes', i )
						collect( child )
					path.pop(); path.pop()
				}
			}
		}
		
		var attrs = [].slice.call( node.attributes )
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
				node.removeAttribute( 'jin-sample-props' )
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
				node.removeAttribute( 'jin-sample-events' )
			}
			
		}
	}
	
	collect( node )
	
	return rules
}})

$jin.atom.prop({ '$jin.sample..view': {} })

$jin.property({ '$jin.sample..covers': null })

$jin.property({ '$jin.sample..activated': function( val ){
	if( !arguments.length ) return
	var covers = this.covers()
	
	if( val ){
		//$jin.atom.slaves.unshift( null )
		covers.forEach( function( cover ){
			cover.update()
		} )
		//$jin.atom.slaves.shift()
	} else {
		covers.forEach( function( cover ){
			cover.disobeyAll()
		} )
	}
}})

$jin.method({ '$jin.sample.proto..make': function( view ){
	var pool = $jin.sample.pool( this.id() )
	var sample = pool.pop()
	if( !sample ){
		var rules = this.rules()
		var node = this.nativeNode().cloneNode( true )
		sample = $jin.sample( node ).proto( this ).rules( rules )
	}
	//sample.view( view )
	return sample
}})

$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

$jin.method({ '$jin.sample..free': function( ){
	//this.view( null )
	$jin.sample.pool( this.proto().id() ).push( this )
}})

$jin.property({ '$jin.sample..proto': null })

$jin.method({ '$jin.sample..rules': function( rules ){
	if( !arguments.length ) throw new Error( 'Rules is not getter' )
	
	var node = this.nativeNode()
	var sample = this
	var covers = []
	
	rules.forEach( function ruleIterator( rule ){
		var current = node
		
		var pull = function( prev ){
			var view = sample.view()
			if( !view ) return
			
			return view[ rule.key ]()
		}
		
		rule.path.forEach( function pathIterator( name ){
			current = current[ name ]
		} )
		
		if( rule.attrName ){
			var cover = $jin.atom(
			{	name: rule.path.join( '/' ) + '/@' + rule.attrName + '=' + rule.key
			,	pull: pull
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
			{	name: rule.path.join( '/' ) + '/' + rule.fieldName + '=' + rule.key
			,	pull: pull
			,	push: function fieldPush( next, prev ){
					if( next === void 0 ) return
					if( current[ rule.fieldName ] == next ) return
					current[ rule.fieldName ] = next
				}
			})
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
			{	name: rule.path.join( '/' ) + '=' + rule.key
			,	push: function(){}
			, 	pull: function contentPull( oldValue ){
					var view = sample.view()
					
					var value = view ? view[ rule.key ]() : null
					
					if( typeof value !== 'object' ){
						var content = ( value == null ) ? '' : String( value )
						
						if( 'textContent' in current ) var oldContent = current.textContent
						else var oldContent = current.innerText
						
						if( content === oldContent ) return 
						
						if( 'textContent' in current ) current.textContent = content
						else current.innerText = content
						
						return value
					}
					
					if(( value == null )||( typeof oldValue !== 'object' )){
						var child; while( child = current.firstChild ) current.removeChild( child )
						oldValue = []
					}
					
					if( value == null ) return value
					
					if(!( value.length >= 0 )) value = [ value ]
					
					if( oldValue === value ) return value
					
					value = value.map( function( item, index ){
						if( item == null ) return
						
						if( typeof item !== 'object' ) item = document.createTextNode( String( item ) )
						
						return item
					} )
					
					oldValue = oldValue || []
					
					oldValue = oldValue.filter( function( item ){
						var newIndex = value.indexOf( item )
						if( ~newIndex ) return true
						
						if( typeof item.nativeNode === 'function' ) var itemNode = item.nativeNode()
						else var itemNode = item
						
						if( itemNode.parentNode === current ){
							current.removeChild( itemNode )
							if( typeof item.freezed === 'function' ) item.freezed( true )
						}
						
						return false
					} )
					
					value.forEach( function( item, index ){
						var oldItem = oldValue[ index ]
						if( oldItem === item ) return
						
						if( typeof item.freezed === 'function' ) item.freezed( false )
						
						if( typeof item.nativeNode === 'function' ) item = item.nativeNode()
						if( oldItem && ( typeof oldItem.nativeNode === 'function' ) ) oldItem = oldItem.nativeNode()
						current.insertBefore( item, oldItem || null )
					} )
					
					return value
				}
			} )
		}
		
		sample.entangle( cover )
		
		covers.push( cover )
		
		$jin.atom.slaves.unshift( null )
		cover.pull()
		$jin.atom.slaves.shift()
	} )
	
	this.covers( covers )
	
	return this
}})
