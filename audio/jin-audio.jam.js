$jin.atom.prop({ '$jin.audio.input': {
	pull: function( ){
		
		var constraint = { audio: true }
		
		var onDone = function( stream ){
			$jin.audio.input( stream )
		}
		
		var onError = function( error ){
			console.error( error )
		}
		
		var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
		
		getUserMedia.call( navigator, constraint, onDone, onError )
		
	}
}})

$jin.atom.prop({ '$jin.audio.inputText': {
	pull: function( ){
		
		var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		var recognition = new SpeechRecognition()
		
		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = 'ru'
		
		recognition.onresult = function( event ){
			var tokens = []
			for( var i = 0; i < event.results.length; ++i ){
				var result = event.results[ i ]
				tokens.push( result.item( 0 ).transcript )
			}
			$jin.audio.inputText( tokens )
		}
		
		recognition.onerror = function( event ){
			console.log( event )
		}
		
		recognition.onend = function( event ){
			recognition.start()
		}
		
		recognition.start()
		
		return []
	}
}})

$jin.atom.prop({ '$jin.audio.output': {
	pull: function( ){
		return []
	},
	put: function( next, prev ){
		
		if( !prev ) prev = []
		
		var AudioContext = window.AudioContext || window.webkitAudioContext
		
		var context = new AudioContext
		var source = context.createMediaStreamSource( next )
		source.connect( context.destination )
		console.log( 'source', source )
		
		prev.push( next )
		
		$jin.audio.outputAtom().notify()
		
		return prev
	}
}})
