$jin.method({ '$jin.build4web.all': function( mod, vary ){
    mod= $jin.sourceFile( mod )
    
    var res= { dev: {}, release: {} }
    
    res.release.sample= $jin.build4web.sample.release( mod, vary )
    
    var jsModules = [ res.release.sample ].concat( mod.deepModuleList() )
    res.dev.js= $jin.build4web.js.dev( mod, vary, jsModules )
    res.release.js= $jin.build4web.js.release( mod, vary, jsModules )
    
    res.dev.css= $jin.build4web.css.dev( mod, vary )
    res.release.css= $jin.build4web.css.release( mod, vary )
    
    //res.dev.xsl= $jin.build4web.xsl.dev( mod, vary )
    //res.release.xsl= $jin.build4web.xsl.release( mod, vary )
    
    //res.dev.doc= $jin.build4web.doc.dev( mod, vary )
    //res.release.doc= $jin.build4web.doc.release( mod, vary )
    
    return res
}})
