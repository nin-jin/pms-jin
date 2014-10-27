/**
 * @name $jin.sample
 * @class $jin.sample
 * @returns $jin.sample
 * @mixins $jin.klass
 * @mixins $jin.dom
 */
$jin.klass({ '$jin.sample': [ '$jin.dom' ] })

/**
 * @name $jin.sample.strings
 * @method strings
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample.strings': {
	value: '',
	put: function( next, prev ){
		return $jin.sample.strings() + next
	}
}})

/**
 * @name $jin.sample.templates
 * @method templates
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample.templates': {
	pull: function( ){
		var strings = this.strings()
		if( !strings ) throw new Error( 'Please, set up $jin.sample.strings' )
		return $jin.dom( '<div xmlns="http://www.w3.org/1999/xhtml">' + $jin.sample.strings() + '</div>' )
	}
}})

/**
 * @name $jin.sample.dom
 * @method dom
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop.hash({ '$jin.sample.dom': {
	pull: function( name ){
		var selector = '[' + name + ']'
		
		var dom = $jin.sample.templates().cssFind( selector )
		if( !dom ) throw new Error( 'Sample not found (' + selector + ')' )
		
		return dom.nativeNode()
	}
}})

/**
 * @name $jin.sample.rules
 * @method rules
 * @static
 * @member $jin.sample
 */
$jin.atom1.prop.hash({ '$jin.sample.rules': { pull: function( name ){
	var node = this.dom( name )
	
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
					rules.push({
						key: key,
						path: path.slice(),
						coverName: '$jin.sample:' + name + '/' + path.join( '/' ) + '=' + key,
						attach: function( rule, sample, current ){
							var cover = $jin.atom1(
							{	name: rule.coverName
							,	context: sample
							,	pull: function jin_sample_pullChilds( ){
									var view = sample.view()
									if( !view ) return null

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									return prop.call( view )
								}
							, 	merge: function contentPull( nextItems, prevItems ){ return $jin.atom1.bound( function( ){
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
										//if( item.element ) return item.element()
										return item
									} )
									
									prevItems.reduceRight( function jin_sample_freePrevs( nope, item ){
										if( typeof item === 'string' ) return
										if( nextItems.indexOf( item ) !== -1 ) return
										var sample = item.element ? item.element() : item 
										if( sample.view ) sample.view( null )
									}, void 0 )
									
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
											var node = item
											if( node.element ) node = node.element()
											if( node.nativeNode ) node = node.nativeNode()
											var index = elements.indexOf( node )
											if( index >= 0 ) elements[ index ]  = null
											return node
										}
									} )
									
									var removeNode = function jin_sample_removeNode( node ){
										if( !node ) return
										if( node.parentNode !== current ) return
										current.removeChild( node )
									}
									
									elements.forEach( removeNode )
									textNodes.forEach( removeNode )
									
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
								})}
							} )
							sample.entangle( cover )
							cover.pull()
						}
					})
					
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
			
			var props = node.getAttribute( 'jin-sample-props' )
			if( props ){
				props.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var subPath = chunk.split( /[-_:=.]/g )
					if( !subPath[0] ) return

					var key = subPath.pop()
					var fieldName = subPath.pop()
					
					rules.push({
						key: key,
						path: path.concat( subPath ),
						coverName: '$jin.sample:' + name + '/' + path.join( '/' ) +  ( subPath.length ? '.' + subPath.join( '.' ) : '' ) + '.' + fieldName + '=' + key,
						fieldName: fieldName,
						attach: function( rule, sample, current ){
							if( [ 'value', 'checked' ].indexOf( rule.fieldName ) !== -1 && [ 'select', 'input', 'textarea' ].indexOf( node.nodeName ) !== -1 ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Handler (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current[ rule.fieldName ] )
								}
								sample.entangle( $jin.dom( current ).listen( 'input', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'change', handler ) )
								sample.entangle( $jin.dom( current ).listen( 'click', handler ) )
							}
							if( rule.fieldName === 'scrollTop' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current.scrollTop )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							} else if( rule.fieldName === 'scrollLeft' ){
								var handler = function( event ){
									var view = sample.view()
									if( !view ) return

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									prop.call( view, current.scrollLeft )
								}
								sample.entangle( $jin.dom( current ).listen( 'scroll', handler ) )
							}
							var cover = $jin.atom1(
							{	name: rule.coverName
							,	context: sample
							,	pull: function jin_sample_pullProp( ){
									var view = sample.view()
									if( !view ) return null

									var prop = view[ rule.key ]
									if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

									return prop.call( view )
								}
							,	push: function fieldPush( next, prev ){
									if( next == null ) return
									if( current[ rule.fieldName ] == next ) return
									current[ rule.fieldName ] = next
								}
							})
							sample.entangle( cover )
							cover.pull()
						}
					})
				} )
				node.removeAttribute( 'jin-sample-props' )
			}
			
			var events = node.getAttribute( 'jin-sample-events' )
			if( events ){
				events.split( /[;\s&]+/g )
				.forEach( function( chunk ){
					if( !chunk ) return
					
					var eventName = chunk.split( /[-_:=.]/g )
					if( !eventName[0] ) return

					var key = eventName.pop()
					eventName = eventName.join( '.' )
					
					var shortFound = /^(on)(\w+)$/.exec( eventName )
					if( shortFound ){
						var type = shortFound[1]
						var name = shortFound[2]
						rules.push({
							key: key,
							path: path.slice(),
							eventName: name,
							attach: function( rule, sample, current ){
								var listener = $jin.dom( current ).listen( rule.eventName, function eventHandler( event ){
									var view = sample.view()
									if( !view ) return
									
									var handler = view[ rule.key ]
									if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..' + rule.key + ')' )
									
									handler.call( view, $jin.dom.event( event ) )
								})
								sample.entangle( listener )
							}
						})
					} else {
						var event = $jin.glob( eventName )
						if( !event ) throw new Error( 'Unknown event [' + eventName + ']' )
						rules.push({
							key: key,
							path: path.slice(),
							event: event,
							attach: function( rule, sample, current ){
								var listener = rule.event.listen( current, function eventHandler( event ){
									var view = sample.view()
									if( !view ) return
									
									var handler = view[ rule.key ]
									if( !handler ) throw new Error( 'View handler is not defined (' + view.constructor + '..'  + rule.key + ')' )
									
									handler.call( view, event )
								})
								sample.entangle( listener )
							}
						})
					}
				} )
				node.removeAttribute( 'jin-sample-events' )
			}
			
			var attrList = []
			for( var i = 0; i < attrs.length; ++i ){
				attrList.push( attrs[ i ] )
			}
			attrList.forEach( function( attr ){
				var found = /^\{(\w+)\}$/g.exec( attr.nodeValue )
				if( !found ) return
				
				var key = found[1]
				var attrName = attr.nodeName
				
				var rule = {
					key: key,
					attrName: attrName,
					coverName: '$jin.sample:' + name + '/' + path.join( '/' ) + '/@' + attrName + '=' + key,
					path: path.slice(),
					attach: function( rule, sample, node ){
						var cover = $jin.atom1(
						{	name: rule.coverName
						,	context: sample
						,	pull: function jin_sample_pullAttr( ){
								var view = sample.view()
								if( !view ) return null

								var prop = view[ rule.key ]
								if( !prop ) throw new Error( 'Property (' + rule.key + ') is not defined in (' + view.constructor + ')' )

								var next = prop.call( view )
								return next ? String( next ) : next
							}
						,	push: function attrPush( next, prev ){
								if( next == null ) node.removeAttribute( rule.attrName )
								else node.setAttribute( rule.attrName, next )
							}
						})
						sample.entangle( cover )
						cover.pull()
					}
				}
				rules.push( rule )
				
				node.removeAttribute( attrName )
			})
			
		}
	}
	
	collect( node )
	
	return rules
}}})

/**
 * @name $jin.sample.pool
 * @method pool
 * @static
 * @member $jin.sample
 */
$jin.property.hash({ '$jin.sample.pool': { pull: function( ){
	return []
}}})

/**
 * @name $jin.sample.exec
 * @method exec
 * @static
 * @member $jin.sample
 */
$jin.method({ '$jin.sample.exec': function( type ){
	this['$jin.wrapper.exec']
	
	var pool = this.pool( type )
	var sample = pool.pop()
	
	if( !sample ) sample = this[ '$jin.klass.exec' ]({ type: type })
	
	return sample
}})


/**
 * @name $jin.sample#init
 * @method init
 * @member $jin.sample
 */
$jin.method({ '$jin.sample..init': function( config ){
	this['$jin.dom..init']
    return this['$jin.klass..init']( config )
}})

/**
 * @name $jin.sample#type
 * @method type
 * @member $jin.sample
 */
$jin.property({ '$jin.sample..type': String })

/**
 * @name $jin.sample#view
 * @method view
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample..view': {
	push: function( next, prev ){
		if( next === prev ) return prev
		
		if( prev ){
			var type = this.type()
			var prevSample = prev.sample( type )
			if( prevSample === this ) prev.sample( type, void 0 )
		}
		
		if( next == null ){
			var pool = $jin.sample.pool( this.type() )
			pool.push( this )
		}
		
		return next
	}
}})

/**
 * @name $jin.sample#nativeNode
 * @method nativeNode
 * @member $jin.sample
 */
$jin.atom1.prop({ '$jin.sample..nativeNode': {
	resolves: [ '$jin.dom..nativeNode' ],
	pull: function( ){
		var rules = this.constructor.rules( this.type() )
		return this.constructor.dom( this.type() ).cloneNode( true )
	},
	push: function( next ){
		if( !next ) throw new Error( 'Not found source node' )
		
		var rules = this.constructor.rules( this.type() )
		var sample = this
		
		rules.forEach( function ruleIterator( rule ){
			var current = next
			
			rule.path.forEach( function pathIterator( name ){
				current = current[ name ]
			} )
			
			if( !current ) throw new Error( 'Not found target node' )
			
			rule.attach( rule, sample, current )
		} )
	}
}})
