$jin.klass({ '$jin.debuild' : [] })

$jin.atom1.prop({ '$jin.debuild..vary' : {
    pull : function(){
        var vary = Object.create( $jin.param.hash() )
        vary.env = 'web'
        return vary
    }
}})

$jin.method({ '$jin.debuild..request' : function( request ){
    var uri = $jin.uri.parse( request.url )
    var target = $jin.file( '.' + uri.path() )

    if( /\.js$/.test( target.name() ) ){
        this.js( target.relate() )
    }

    if( /\.css$/.test( target.name() ) ){
        this.css( target.relate() )
    }

}})

$jin.atom1.prop.hash({ '$jin.debuild..js' : {
    pull : function( path ) {
        
        var target = $jin.file( path )
        var targetMap = target.parent().resolve( target.name() + '.map' )
    
        var pack = target.parent().parent()

        var vary = Object.create( this.vary() )
        target.name().split( '.' ).forEach( function( chunk ) {
            var names = chunk.split( '=' )
            if( names.length < 2 ) return
            vary[ names[0] ] = names[1]
        })

        var build = $jin.build( $jin.uri({ path: pack.relate() , query: vary }) )

        return build.jsCompiled()[0].version()
    }
}})

$jin.atom1.prop.hash({ '$jin.debuild..css' : {
    pull : function( path ) {

        var target = $jin.file( path )
        var targetMap = target.parent().resolve( target.name() + '.map' )

        var pack = target.parent().parent()
        var build = $jin.build( $jin.uri({ path : pack.relate(), query : this.vary() }) )

        return build.cssCompiled()[0].version()
    }
}})

$jin.server.resources( 'jin/debuild', $jin.debuild() )