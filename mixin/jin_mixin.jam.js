this.$jin.mixin = function( ){ // arguments: sourceName+, targetName
    var trait = $jin.mixin.object.apply( this, arguments )
    
    for( var index = 0; index < arguments.length; ++index ){
        arguments[ index ] += '.'
    }
    $jin.mixin.object.apply( this, arguments )
    
    return trait
}

this.$jin.mixin.object = function( ){ // arguments: sourceName+, targetName
    var sourcePathList = [].slice.call( arguments )
    var targetPath = sourcePathList.pop()
    var target = $jin.trait( targetPath )
    
    sourcePathList.forEach( function( sourcePath ){
        var source = $jin.trait( sourcePath )
        source.$jin_mixin_slaveList = source.$jin_mixin_slaveList || []
        if( ~source.$jin_mixin_slaveList.indexOf( targetPath ) ) return
        source.$jin_mixin_slaveList.push( targetPath )
        
        for( var key in source ){
            var func = source[ key ]
            if(( typeof func !== 'function' )||( !func.jin_method_path )){
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.jin_method_path.replace( /^([$\w]*\.)+/, '' )
			$jin.method( targetPath + '.' + methodName, func )
        }
    })
    
    return target
}
