/**
 * @name $jin.dom.range
 * @class $jin.dom.range
 * @returns $jin.dom.range
 * @mixins $jin.klass
 * @mixins $jin.wrapper
 */
$jin.klass({ '$jin.dom.range': [ '$jin.wrapper' ] })

$jin.alias( '$jin.wrapper..raw', '$jin.dom.range..raw', 'nativeRange' )

/**
 * @name $jin.dom.range#nativeRange
 * @method nativeRange
 * @member $jin.dom.range
 */
$jin.property({ '$jin.dom.range..nativeRange': function( range ){
	if( !range ) throw new Error( 'Wrong TextRange object (' + range + ')' )
	return range
}})

/**
 * @name $jin.dom.range.create
 * @method create
 * @static
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range.create': function( ){
	return $jin.doc().selection().range()
}})

/**
 * @name $jin.dom.range#select
 * @method select
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..select': function( ){
	var sel = $jin.doc().selection()
	var range = this.nativeRange()
	if( range.select ){
		range.select()
	} else {
		sel.clear()
		sel.nativeSelection().addRange( range )
	}
	return this
}})

/**
 * @name $jin.dom.range#collapse2start
 * @method collapse2start
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..collapse2start': function( ){
	this.nativeRange().collapse( true )
	return this
}})

/**
 * @name $jin.dom.range#collapse2end
 * @method collapse2end
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..collapse2end': function( ){
	this.nativeRange().collapse( false )
	return this
}})

/**
 * @name $jin.dom.range#clear
 * @method clear
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..clear': function( ){
	this.nativeRange().deleteContents()
	return this
}})

/**
 * @name $jin.dom.range#html
 * @method html
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..html': function( html ){
	if( !arguments.length ) return $jin.dom( this.nativeRange().cloneContents() ).toString()
	
	var node = $jin.dom( html )
	this.replace( node )
	
	return this
}})

/**
 * @name $jin.dom.range#text
 * @method text
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..text': function( text ){
	if( !arguments.length ) return $jin.dom.html2text( this.html() )
	
	this.html( $jin.dom.escape( text ) )
	
	return this
}})

/**
 * @name $jin.dom.range#replace
 * @method replace
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..replace': function( dom ){
	var node = $jin.dom( dom ).nativeNode()
	var range = this.nativeRange()
	
	this.clear()
	range.insertNode( node )
	range.selectNode( node )
	
	return this
}})

/**
 * @name $jin.dom.range#ancestor
 * @method ancestor
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..ancestor': function( ){
	return $jin.dom( this.nativeRange().commonAncestorContainer )
}})

if( $jin.support.textModel() === 'w3c' ){
	/**
 * @name $jin.dom.range#compare
 * @method compare
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = Range[ how.replace( '2', '_to_' ).toUpperCase() ]
		
		return range.compareBoundaryPoints( how, this.nativeRange() )
	}})
} else {
	/**
 * @name $jin.dom.range#compare
 * @method compare
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..compare': function( how, range ){
		if( range.nativeRange ) range = range.nativeRange()
		how = { start2start: 'StartToStart', start2end: 'StartToEnd', end2start: 'EndToStart', end2end: 'EndToEnd' }[ how ]
		
		return range.compareEndPoints( how, this.nativeRange() )
	}})
}

/**
 * @name $jin.dom.range#hasRange
 * @method hasRange
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..hasRange': function( range ){
	if( range.nativeRange ) range = range.nativeRange()
	var isAfterStart = ( this.compare( 'start2start', range ) >= 0 )
	var isBeforeEnd = ( this.compare( 'end2end', range ) <= 0 )
	return isAfterStart && isBeforeEnd
}})

/**
 * @name $jin.dom.range#equalize
 * @method equalize
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..equalize': function( how, range ){
	if( range.nativeRange ) range = range.nativeRange()
	how = how.split( 2 )
	var method = { start: 'setStart', end: 'setEnd' }[ how[ 0 ] ]
	this.nativeRange()[ method ]( range[ how[1] + 'Container' ], range[ how[1] + 'Offset' ] )
	return this
}})

/**
 * @name $jin.dom.range#clone
 * @method clone
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..clone': function( ){
	return $jin.dom.range( this.nativeRange().cloneRange() )
}})

/**
 * @name $jin.dom.range#aimNodeContent
 * @method aimNodeContent
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..aimNodeContent': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	var range = this.nativeRange()
	if( range.selectNodeContents ) range.selectNodeContents( node )
	else if( range.moveToElementText ) range.moveToElementText ( node )
	return this
}})

/**
 * @name $jin.dom.range#aimNode
 * @method aimNode
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..aimNode': function( node ){
	if( node.nativeNode ) node = node.nativeNode()
	this.nativeRange().selectNode( node )
	return this
}})

/**
 * @name $jin.dom.range#move
 * @method move
 * @member $jin.dom.range
 */
$jin.method({ '$jin.dom.range..move': function( offset ){
	this.collapse2start()
	
	if( offset === 0 ) return this
	
	var thisRange = this.nativeRange()
	
	var current = $jin.dom( thisRange.startContainer )
	if( thisRange.startOffset ){
		var temp = current.nativeNode().childNodes[ thisRange.startOffset - 1 ]
		if( temp ){
			current = $jin.dom( temp ).follow()
		} else {
			offset += thisRange.startOffset
		}
	}
	
	while( current ){
		if( current.name() === '#text' ){
			var range = $jin.dom.range.create().aimNode( current )
			var length = current.nativeNode().nodeValue.length
			
			if( !offset ){
				this.equalize( 'start2start', range )
				return this
			} else if( offset > length ){
				offset -= length
			} else {
				this.nativeRange().setStart( current.nativeNode(), offset )
				return this
			}
		}
		if( current.name() === 'br' ){
			if( offset > 1 ){
				offset -= 1
			} else {
				var range = $jin.dom.range.create().aimNode( current )
				this.equalize( 'start2end', range )
				return this
			}
		}
		current = current.delve()
	}
	
	return this
}})
