/**
 * @name $jin.file.type.jamJS
 * @class $jin.file.type.jamJS
 * @returns $jin.file.type.jamJS
 * @mixins $jin.klass
 * @mixins $jin.file.type.js
 */
$jin.klass({ '$jin.file.type.jamJS': [ '$jin.file.type.js' ] })

/**
 * @name $jin.file.type.jamJS.ext
 * @method ext
 * @static
 * @member $jin.file.type.jamJS
 */
$jin.method({ '$jin.file.type.jamJS.ext': function( ){
	this['$jin.file.type.js.ext']
	return '.jam.js'
}})

/**
 * @name $jin.file.type.jamJS#dependList
 * @method dependList
 * @member $jin.file.type.jamJS
 */
$jin.atom1.prop({ '$jin.file.type.jamJS..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {}
		
		String( this.content() )
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace
		(   /\$([a-z][a-z0-9]+(?:[._][a-z0-9]+)*)/ig
		,   function( str, path ){
				depends[ path.replace( /[._-]/g, '/' ) ] = true
			}
		)
		
		return Object.keys( depends )
	}
}})

/**
 * @name $jin.file.type.jamJS#content
 * @method content
 * @member $jin.file.type.jamJS
 */
$jin.atom1.prop({ '$jin.file.type.jamJS..content': {
	resolves: [ '$jin.file.base..content' ],
	pull: function( ){
		var next = this['$jin.file.base..content']()
		var next2 = this.constructor.normalize( next )
		if( next !== next2 ) this.content( next2 )
		return next2
	},
    put: function( next ){
		return this['$jin.file.base..content']( next )
	}
}})

/**
 * @name $jin.file.type.jamJS.normalize
 * @method normalize
 * @static
 * @member $jin.file.type.jamJS
 */
$jin.method({ '$jin.file.type.jamJS.normalize': function( src ){
	src = String( src ).replace( /((\/\*\*)((?:[\s\S](?!\/\*\*))*?)(\*\/[ \t]*[\n\r]*))?(([ \t]*)[$]jin\.(method|definer|klass|error|konst|property(?:\.(?:list|hash))?|atom\.prop(?:\.(?:list|hash))?)\(\{\s['"]([$\w.#]+)['"]:([^\n\r]+))/g, function( str, comm, prefix, doc, suffix, def, indent, type, name, config ){
        var tags = {}
        if( doc ) doc.replace( / \*(?:[ \t]+@(\w+))?(?:[ \t]([^\n\r]+))?/g, function( str, tagName, tagValue ){
            if( !tagName ) tagName = ''
            if( !tags[ tagName ] ) tags[ tagName ] = []
            tags[ tagName ].push( tagValue )
        } )
        tags.name = [ name.replace( /\.\./g, '#' ) ]
        if( type === 'klass' ) {
            tags['class'] = [ name ]
            tags.mixins = [ '$'+'jin.klass' ]
            config.replace(/\$[\w.]+/g, function (ref) {
                tags.mixins.push(ref)
            })
            tags.returns = [ name ]
        } else if( type === 'error' ){
            tags['class'] = [ name ]
            tags.mixins = [ '$'+'jin.error' ]
            config.replace( /\$[\w.]+/g, function( ref ){
                tags.mixins.push( ref )
            } )
            tags.returns = [ name ]
        } else {
            tags.method = [ name.replace( /^.*?(\w+)$/, '$1' ) ]
            tags.member = [ name.replace( /\W+\w+$/, '' ) ]
            if( !/\.\./.test( name ) ){
                tags['static'] = [ null ]
            }
        }
        doc = '\n' + [].concat.apply( [], Object.keys( tags ).map( function( tagName ) {
            return tags[ tagName ].map( function( value ){
                return indent + ' *' + ( tagName ? ' @' + tagName : '' ) + ( value ?  ' ' + value : '' )
            } )
        })).join( '\n' ) + '\n '
        if( !prefix ) prefix = indent + '/**'
        if( !suffix ) suffix = '*/\n'
        return prefix + doc + indent + suffix + def
    } )
	return src
}})

