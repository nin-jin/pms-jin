/**
 * @name $jin.mixin
 * @method mixin
 * @static
 * @member $jin
 */
$jin.definer({ '$jin.mixin': function( targetPath, sourcePathList ){
    var trait = $jin.mixin.object( targetPath, sourcePathList )
    
	sourcePathList = sourcePathList.map( function( sourcePath ){
		return sourcePath + '.'
	})
	
    $jin.mixin.object( targetPath + '.', sourcePathList )
    
    return trait
}})

/**
 * @name $jin.mixin.object
 * @method object
 * @static
 * @member $jin.mixin
 */
$jin.definer({ '$jin.mixin.object': function( targetPath, sourcePathList ){
    var target = $jin.trait( targetPath )
    
    sourcePathList.forEach( function( sourcePath ){
        var source = $jin.trait( sourcePath )
		
        if( !source.jin_mixin_slaveList ) source.jin_mixin_slaveList = []
        if( source.jin_mixin_slaveList.indexOf( targetPath ) >= 0 ) return
        
        for( var key in source ){
            var func = source[ key ]
			if( key.charAt(0) === '_' ) continue
			if( typeof func === 'function' ){
				if( !func.displayName ) func.displayName = sourcePath + '.' + key
			} else {
                if(!( key in target )) target[ key ] = void 0
                continue
            }
            
            var methodName = func.displayName.replace( /^([$\w]*\.)+/, '' )
			$jin.method( targetPath + '.' + methodName, func )
        }
		
        source.jin_mixin_slaveList.push( targetPath )
    })
    
    return target
}})
