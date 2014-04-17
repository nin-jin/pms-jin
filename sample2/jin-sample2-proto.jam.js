$jin.klass({ '$jin.sample2.proto': [ '$jin.registry' ] })

$jin.property({ '$jin.sample2.proto..nativeNode': function( ){
	var selector = '[' + this.id() + ']'
	
	var node = $jin.sample2.templates().cssFind( selector )
	if( !node ) throw new Error( 'Sample not found (' + selector + ')' )
	
	return node.raw()
}})

$jin.property({ '$jin.sample2.proto..rules': function( ){
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
