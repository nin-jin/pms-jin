this.$jin.autoloader=
$jin.proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'inspect' ) return function(){ return '$jin.autoloader( "' + prefix + '" )' }
        
        console.log( 'Module [' + path + '] not found. Trying to install them via NPM...' )
        //if( !$ jin.confirm( 'Module [' + path + '] not found. Try to install them via NPM?' ) )
        //    throw error
        
        var npm= $jin.autoloader().npm
        $jin.async2sync( npm.load ).call( npm, {} )
        $jin.async2sync( npm.commands.install ).call( npm, [ path ] )
    }
    
    return require( path )
} } )
