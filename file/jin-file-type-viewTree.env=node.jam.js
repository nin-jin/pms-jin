$jin.klass({ '$jin.file.type.viewTree': [ '$jin.file.type.tree' ] })

$jin.method({ '$jin.file.type.viewTree.ext': function( ){
	this['$jin.file.type.tree.ext']
	return '.view.tree'
}})

$jin.atom1.prop({ '$jin.file.type.viewTree..dependList': {
	resolves: [ '$jin.file.base..dependList' ],
	pull: function( ){
		var depends = {
			//'jin2/prop' : 0,
		}
		
		String( this.content() )
		.replace
		(   /[@$]([a-z][a-z0-9]+(?:_[a-z0-9]+)+)/ig
		,   function( str, path ){
				depends[ path.replace( /[_]/g, '/' ) ] = 0
			}
		)
		
		return depends
	}
}})

$jin.atom1.prop.list({ '$jin.file.type.viewTree..jsFiles': {
	resolves: [ '$jin.file.base..jsFiles' ],
	pull: function( prev ){
		var target = this.parent().buildFile( this.name(), {}, 'ts' )
		var tree = $jin_tree2.fromString( String( this.content() ) , this.relate() )

		var content = ''
		tree.childs.forEach( function( def ) {
			if( !/^\$\w+$/.test( def.type ) ) return
			var parent = def.childs[0].childs[0]

			var members = {}
			var fields = {}
			var attrs = {}
			var events = {}
			parent.childs.forEach( function( param ) { addProp( param , '' ) } )
            function addProp( param , prefix ) {
				if( !param.type || /^-/.test( param.type ) ) return
				
				switch( param.type[0] ) {
					/*case '@' :
						var items = param.childs.map( function( item ) {
							switch( item.type ) {
								case '<' :
									addProp( item.childs[0] )
									return 'this.' + item.childs[0].type + '()'
								case '' :
									return '$'+'jin2_atom( () => (' + JSON.stringify( item.value ) + ') )'
								default :
									return ''
							}
						} )
						attrs[ param.type.substring(1) ] = items.join(' + ')
						return
					case '.' :
						switch( param.childs[0].type ) {
							case '<' :
								addProp( param.childs[0].childs[0] )
								fields[ param.type.substring(1) ] = 'this.' + param.childs[0].childs[0].type + '()'
								return
							default :
								fields[ param.type.substring(1) ] = '$' + 'jin2_atom( () => (' + JSON.stringify( param.childs[0] ) + ') )'
								return
						}
					case '*' :
						switch( param.childs[0].type ) {
							case '>' :
								addProp( param.childs[0].childs[0] )
								events[ param.type.substring(1) ] = 'this.' + param.childs[0].childs[0].type + '()'
								return
							default :
								return
						}*/
					default :
						var firstVal = param.childs[0]
						if( firstVal ) {
							switch( firstVal.type[0] ) {
								case ':' :
                                    switch( firstVal.childs[0].type[0] ) {
                                        case '$' : // factory
                                            var overs = firstVal.childs[0].childs.map( function( over ) {
                                                if( !/^\w+$/.test( over.type ) ) return ''
                                                switch( over.childs[0].type ) {
                                                    case '<' :
                                                        addProp( over.childs[0].childs[0] , prefix + param.type + '_' )
                                                        return '\t\tview.' + over.type + ' = () => this.' + over.childs[0].childs[0].type + '()\n'
                                                    case ':' :
                                                        return '\t\tview.' + over.type + ' = () => new $'+'jin2_atom( () => ( ' + JSON.stringify( over.childs[0].childs[0] ) + ' ) )\n'
                                                    default :
        												throw new Error( 'view.tree syntax error: ' + over + over.uri ) 
                                                }
                                            } )
                                            members[ param.type ] = '\t@ $'+'jin2_grab ' + param.type +'() { return new $'+'jin2_atom_own( () => { \n\t\tvar view = new ' + firstVal.childs[0].type + '\n' + overs.join('') + '\t\treturn view\n\t} ) }\n'
                                            return
                                        default :
                                            members[ param.type ] = '\t@ $'+'jin2_grab ' + param.type +'() { return new $'+'jin2_atom( () => (' + JSON.stringify( firstVal.childs[0] ) + ') ) }\n'
                                            return 
                                    }
                                case '<':
                                    if( param.childs.length === 1 ) {
                                        addProp( param.childs[0].childs[0] , prefix + param.type + '_' )
                                        members[ param.type ] = '\t' + param.type +'() { return this.' + param.childs[0].childs[0].type + '() }\n'
                                        return 
                                    }
								default :
									var items = []
                                    param.childs.forEach( function( item ) {
										switch( item.type ) {
											case '<' :
												addProp( item.childs[0] , prefix + param.type + '_' )
												items.push( 'this.' + item.childs[0].type + '().get()' )
                                                return
											case '' :
												items.push( JSON.stringify( item.value ) )
                                                return
											case '-' :
												return
											default :
												throw new Error( 'view.tree syntax error: ' + item + item.uri ) 
										}
									} )
									members[ param.type ] = '\t@ $'+'jin2_grab ' + param.type +'() { return new $'+'jin2_atom( () => [ ' + items.join(' , ') + ' ] ) }\n'
									return 
							}
						} else {
							//members[ param.type ] = members[ param.type ] || null
						}
				}
			}
			
			var paths = Object.keys( fields )
			if( paths.length ) members[ 'field' ] = '\tfield(){ return {\n' + paths.map( function( path ) {
				return '\t\t' + JSON.stringify( path ) + ': ' + fields[ path ] + ',\n'
			} ).join('') + '\t} }\n'
			
			var attrNames = Object.keys( attrs )
			if( attrNames.length ) members[ 'attr' ] = '\tattr() { return {\n' + attrNames.map( function( name ) {
				return '\t\t' + JSON.stringify( name ) + ': ' + attrs[ name ] + ',\n'
			} ).join('') + '\t} }\n'
			
			var eventNames = Object.keys( events )
			if( eventNames.length ) members[ 'event' ] = '\tevent() { return {\n' + eventNames.map( function( name ) {
				return '\t\t' + JSON.stringify( name ) + ': ' + events[ name ] + ',\n'
			} ).join('') + '\t} }\n'
			
			var body = Object.keys( members ).map( function( name ) {
				return members[ name ] || '\t' + name +'() {\n\t\treturn { get : () => null , set : next => null }\n\t}\n'	
			}).join( '' )

			var classes = 'module $'+'mol { @$'+'mol_replace export class ' + def.type + ' extends ' + parent.type + ' {\n' + body + '} }\n'

			content += classes + '\n'
		})

		target.content( content )

		if( prev ) $jin.log( target.relate() )

		return [ target ]
	}
}}) 
