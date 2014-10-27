/**
 * @name $jin.chat.streamer
 * @method streamer
 * @static
 * @member $jin.chat
 */
$jin.atom1.prop({ '$jin.chat.streamer': {
	pull: function(){
		return $jin.audio.input()
	},
	push: function( next ){
		if( !next ) return
		$jin.audio.output( next )
	}
}})

/**
 * @name $jin.chat.logger
 * @method logger
 * @static
 * @member $jin.chat
 */
$jin.atom1.prop({ '$jin.chat.logger': {
	pull: function(){
		return $jin.audio.inputText()
	},
	push: function( next ){
		if( !next ) return
		document.body.innerHTML = next.join( '<br/>' )
	}
}})
