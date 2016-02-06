this.$jin.autoloader=
$jin.proxy( { get: function( prefix, name ){
    var path= ( prefix || '' ) + name
    
    try {
        path= require.resolve( path )
    } catch( error ){
        if( error.code !== 'MODULE_NOT_FOUND' ) throw error
        if( path === 'npm' ) throw error
        
        if( name === 'constructor' ) return function(){ return function(){} }
        
        if( name === 'inspect' ) return function(){ return '$jin.autoloader( "' + prefix + '" )' }
        
        $jin.log.error( 'Module [' + path + '] not found')
        $jin.log.info( 'npm install ' + path )
        
        var npm= $jin.autoloader().npm
        $jin.async2sync( npm.load ).call( npm, {} )
        $jin.async2sync( npm.commands.install ).call( npm, [ path ] )
    }
    
    return require( path )
} } )
