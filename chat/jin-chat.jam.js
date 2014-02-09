$jin.atom.prop({ '$jin.chat.streamer': {
	pull: function(){
		return $jin.audio.input()
	},
	push: function( next ){
		if( !next ) return
		$jin.audio.output( next )
	}
}})

$jin.atom.prop({ '$jin.chat.logger': {
	pull: function(){
		return $jin.audio.inputText()
	},
	push: function( next ){
		if( !next ) return
		document.body.innerHTML = next.join( '<br/>' )
	}
}})
