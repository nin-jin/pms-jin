document.execCommand( 'DefaultParagraphSeparator', false, 'div' )

/**
 * @name $jin.editor
 * @class $jin.editor
 * @mixins $jin.klass
 * @mixins $jin.view2
 * @returns $jin.editor
 */
$jin.klass({ '$jin.editor': [ '$jin.view2' ] })

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
	}
}})

/**
 * @name $jin.editor#onInput
 * @method onInput
 * @member $jin.editor
 */
$jin.method({ '$jin.editor..onInput': function( event ){

	var target = event.target();

//	var sel = $jin.dom.range.create();
//	var offsetStart = target.rangeContent().equalize( 'end2start', sel ).nativeRange().cloneContents().textContent.length
//	var offsetEnd = target.rangeContent().equalize( 'end2end', sel ).nativeRange().cloneContents().textContent.length
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

	var text = target.text()

	var content = text.split( '\n' ).map( function( str ){
		return {
			nodeName: 'div',
			childNodes: str
			? [
				{ nodeName: '#text', nodeValue: str },
				{ nodeName: 'br' }
			] : [
				{ nodeName: 'br' }
			]
		}
	})

	target.tree( content )

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
