this.$jin.execute=
$jin.async2sync( function( command, args, done ){
    var proc= $node.child_process.spawn( command, args, { stdio: 'inherit' } )
    proc.on( 'exit', function( code ){
        if( !code || code == '0') {
			done( code );
			return;
		}
		
		command = command + ' ' + args.join( ' ' )
		if( command.length > 256 ) command = command.substring( 0, 256 ) + '...'
		
		throw new Error( 'Execution of [' + command + '] ends with code ' + code )
    })
} )
