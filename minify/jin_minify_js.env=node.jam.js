/**
 * @name $jin.minify.js
 * @method js
 * @static
 * @member $jin.minify
 */
$jin.method({ '$jin.minify.js': function( file ){
    var config = {}
    //config.output = { semicolons: false, indent_level: 0, beautify: true, space_colon: true }
    var text = $node[ 'uglify-js' ].minify( [ file.path() ], config ).code
    
    file.content( text )
    return file
}})
