document.execCommand( 'DefaultParagraphSeparator', false, 'div' )

/**
 * @name $jin.editor
 * @class $jin.editor
 * @mixins $jin.klass
 * @mixins $jin.view
 * @returns $jin.editor
 */
$jin.klass({ '$jin.editor': [ '$jin.view' ] })

/**
 * @name $jin.editor#isEditable
 * @method isEditable
 * @member $jin.editor
 */
$jin.atom.prop({ '$jin.editor..isEditable': {
	pull: function( ){
		return true
	}
}})

/**
 * @name $jin.editor#valueProp
 * @method valueProp
 * @member $jin.editor
 */
$jin.atom.prop({ '$jin.editor..valueProp': {
	pull: function( ){
		return $jin.value()
	}
}})

/**
 * @name $jin.editor#render
 * @method render
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..render': function( ){
	this.value()
	return true
}})

/**
 * @name $jin.editor#value
 * @method value
 * @member $jin.editor
 */
$jin.atom.prop({ '$jin.editor..value': {
	pull: function( ){
		return this.valueProp()()
	},
	put: function( next ){
		this.valueProp()( next )
		return next
	},
	push: function( next ){
		if( next == null ) return
		
		//$jin.log( 'from', JSON.stringify( this.element().text() ) )
		//$jin.log( 'next', JSON.stringify( next ) )
		
		var content = next.split( '\n' ).map( function( str ){
			return {
				nodeName: 'div',
				childNodes: str
				? [
					str,
					{ nodeName: 'br' }
				] : [
					{ nodeName: 'br' }
				]
			}
		} )
		
		//$jin.log( 'next', JSON.stringify( content ) )
		
		var sel = $jin.dom.range.create()
		var target = this.element()
		
		var offsetStart = $jin.dom( target.rangeContent().equalize( 'end2start', sel ).nativeRange().cloneContents() ).text().length
		var offsetEnd = $jin.dom( target.rangeContent().equalize( 'end2end', sel ).nativeRange().cloneContents() ).text().length
		
		this.element().tree( content )
		
		var zone = target.rangeContent()
		var selStart = zone.clone().move( offsetStart )
		var selEnd = zone.clone().move( offsetEnd )
		
		zone
			.equalize( 'start2start', selStart )
			.equalize( 'end2end', selEnd )
			.select()
		
		$jin.log( offsetStart, offsetEnd )
		
		//$jin.log( 'to', JSON.stringify( this.element().text() ) )
	}
}})

/**
 * @name $jin.editor#onInput
 * @method onInput
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onInput': function( event ){

	var target = event.target();

//
//	//	target.normalize({
//	//		'#text': function( node ){
//	////			var prevText = node.nodeValue;
//	////			var nextText = prevText.replace( /^\s+(?=[^\s])/g, '' ).replace( / /g, '\u00A0' );
//	////			if( prevText !== nextText ) node.nodeValue = nextText;
//	//			return node
//	//		},
//	//		'br': $jin.pipe([]),
//	//		'': function( node ){
//	//			return node.childNodes
//	//		}
//	//	})
//
//	var zone = target.rangeContent()
//	var selStart = zone.clone().move( offsetStart )
//	var selEnd = zone.clone().move( offsetEnd )
//
//	zone
//		.equalize( 'start2start', selStart )
//		.equalize( 'end2end', selEnd )
//		.select()

	var text = target.text().replace( /\n$/, '' )
	
	this.value( text )
}})

/**
 * @name $jin.editor#onFocus
 * @method onFocus
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onFocus': function( event ){
	this.focused( 'true' )
}})

/**
 * @name $jin.editor#onBlur
 * @method onBlur
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onBlur': function( event ){
	this.focused( null )
}})

/**
 * @name $jin.editor#onKeyPress
 * @method onKeyPress
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onKeyPress': function( event ){

	var target = event.target();

	if( event.keyCode() === 13 ){
		var br = target.makeElement( 'br' )
		$jin.dom.range.create().replace( br )

		var next = br.next()
		if( next ) next.rangeContent().collapse2start().select()
		else br.rangeContent().collapse2end().select()

		event.catched( true )
	}
	
	this.onInput( event )
}})
