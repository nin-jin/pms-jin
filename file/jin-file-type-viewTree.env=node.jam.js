$jin.klass({ '$jin.file.type.viewTree': [ '$jin.file.type.tree' ] })

$jin.method({ '$jin.file.type.viewTree.ext': function( ){
	this['$jin.file.type.tree.ext']
	return '.view.tree'
}})

$jin.atom1.prop({ '$jin.file.type.viewTree..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {
			'jin/view/sample' : 1,
			'jin/prop/proxy' : 1
		}

		//String( this.content() )
		//	.replace
		//(   /([a-z][a-z0-9]+(?:-[a-z0-9]+)+)/ig
		//	,   function( str, path ){
		//		depends[ path.replace( /[._-]/g, '/' ) ] = true
		//	}
		//)

		return depends
	}
}})

$jin.atom1.prop.list({ '$jin.file.type.viewTree..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'ts' )
		var tree = $jin.tree.parse( String( this.content() ) ) 
		
		var content = ''
		tree.content().forEach( function( def ) {
			if( !def.name() ) return
			var className = '$' + def.name()
			var tag = def.content()[0]
			
			function makeClasses( suffix , tag ) {
				var attrs = tag.select('@ /').content()
				var attrsList = attrs.map(function (attr) {
					if( typeof attr.content()[0] === 'object' && attr.content()[0].name() === '<' ) {
						var fieldName = attr.content()[0].content()[0].name()
						childList += '\t\t\tthis.view.' + fieldName + '( this.param ).get() ,\n'
						return '\t\t' + JSON.stringify(attr.name()) + ' : this.view.' + fieldName + '( this.param ) ,\n'
					}
					return '\t\t' + JSON.stringify(attr.name()) + ' : new $jin.prop.proxy({ pull : () => ' + JSON.stringify(attr.toString()) + ' }) ,\n'
				})
				var attrsMap = '\tattributes(){ return {\n' + attrsList.join('') + '\t} }\n'

				var fields = tag.select('. /').content()
				var fieldsList = fields.map(function (field) {
					if( typeof field.content()[0] === 'object' && field.content()[0].name() === '<' ) {
						var fieldName = field.content()[0].content()[0].name()
						childList += '\t\t\tthis.view.' + fieldName + '( this.param ).get() ,\n'
						return '\t\t' + JSON.stringify(field.name()) + ' : this.view.' + fieldName + '( this.param ) ,\n'
					}
					return '\t\t' + JSON.stringify(field.name()) + ' : new $jin.prop.proxy({ pull : () => ' + JSON.stringify(field.toString()) + ' }) ,\n'
				})
				var fieldsMap = '\tfields(){ return {\n' + fieldsList.join('') + '\t} }\n'

				var regClass = "\tstatic objectId = $jin.model.classRegister( '" + className + suffix + "' , '$jin.view.sample' )\n"
				var tagName = "\ttagName(){ return '" + tag.name() + "' }\n"
				
				var childList = ''
				var classes = ''
				tag.content().forEach( function( child , index ) {
					if( typeof child !== 'object' ) {
						childList += '\t\t\t' + JSON.stringify( child ) + ' ,\n'
						return
					}
					if( ! child.name() ) return
					if( child.name() === '@' ) return
					if( child.name() === '.' ) return
					if( child.name() === '--' ) return
					if( child.name() === '<' ) {
						var fieldName = child.content()[0].name()
						childList += '\t\t\tthis.view.' + fieldName + '( this.param ).get() ,\n'
						return
					}
					var subfix = suffix + '_' + child.name() + index
					childList += '\t\t\tnew ' + className + subfix + '({ owner : this.owner , view : this.view , name : this.name + "_' + child.name() + index + '" }) ,\n'
					classes += makeClasses( subfix, child )
				})
				var childs = '\tchildNodes( ) {\n\t\treturn [\n' + childList + '\t\t]\n\t}\n'

				var fields = regClass + tagName + attrsMap + fieldsMap + childs
				
				classes = 'module $jin.view {\n\nexport class ' + className + suffix + ' extends $jin.view.sample<any> {\n' + fields + '}\n\n}\n\n' + classes
				
				return classes
			}

			//content += 'module ' + moduleName + ' {\n' + makeClasses( '$'+def.name().split( '-').join( '_' ) , tag ) + '}\n'
			content += makeClasses( "" , tag )
		})
		
		target.content( content )
		
		if( prev ) $jin.log( target.relate() )
		
		return [ target ]
	}
}})
