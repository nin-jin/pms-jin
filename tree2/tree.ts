class $jin_tree2 {
	
	type : string
	data : string
	childs : $jin_tree2[]
	baseUri : string
	row : number
	col : number
	
	constructor( config :{
		type? : string
		value? : string 
		data? : string
		childs? : $jin_tree2[]
		baseUri? : string
		row? : number
		col? : number
	} ) {
		this.type = config.type || ''
		if( config.value ) {
			var childs = $jin_tree2.values( config.value )
			if( config.type || childs.length > 1 ) {
				this.childs = childs.concat( config.childs || [] )
				this.data = config.data || ''
			} else {
				this.data = childs[0].data
				this.childs = config.childs || []
			}
		} else {
			this.data = config.data || ''
			this.childs = config.childs || []
		}
		this.baseUri = config.baseUri || ''
		this.row = config.row || 0
		this.col = config.col || 0
	}
	
	static values( str : string , baseUri? : string ) {
		return str.split( '\n' ).map( ( data , index ) => new $jin_tree2({
			data : data ,
			baseUri : baseUri ,
			row : index + 1
		}) )
	}
	
	clone( config : {
		type? : string
		value? : string
		data? : string
		childs? : $jin_tree2[]
		baseUri? : string
		row? : number
		col? : number
	} ) {
		return new $jin_tree2({
			type : ( 'type' in config ) ? config.type : this.type ,
			data : ( 'data' in config ) ? config.data : this.data ,
			childs : ( 'childs' in config ) ? config.childs : this.childs ,
			baseUri : ( 'baseUri' in config ) ? config.baseUri : this.baseUri ,
			row : ( 'row' in config ) ? config.row : this.row ,
			col : ( 'col' in config ) ? config.col : this.col ,
			value : config.value
		})
	}
	
	static fromString( str : string , baseUri? : string ) {
		
		var root = new $jin_tree2({ baseUri : baseUri })
		var stack = [ root ]
		
		var row = 0
		var lines = str.split( /\n/ )
		lines.forEach( line => {
			++ row
			
			var chunks = /^(\t*)((?:[^\n\t= ]+ *)*)(=[^\n]*)?/.exec( line )
			if( !chunks ) throw $jin2_error({
				reason : 'Syntax error' ,
				row : row ,
				source : line
			})
			
			var indent = chunks[1]
			var path = chunks[2]
			var data = chunks[3]
			
			var deep = indent.length
			var types = path ? path.split( / +/ ) : []
			
			if( stack.length < deep ) throw $jin2_error({
				reason : 'Too more tabs' ,
				row : row ,
				source : line
			})
			
			stack.length  = deep + 1
			var parent = stack[ deep ];
			
			types.forEach( type => {
				if( !type ) return
				var next = new $jin_tree2({
					type : type ,
					baseUri : baseUri ,
					row : row
				})
				parent.childs.push( next )
				parent = next
			})
			
			if( data ) {
				var next = new $jin_tree2({
					data : data.substring( 1 ) ,
					baseUri : baseUri ,
					row : row
				})
				parent.childs.push( next )
				parent = next
			}
			
			stack.push( parent )
			
		})
		
		return root
	}
	
	static fromJSON( json : any , baseUri = '' ) {
		var type = $jin_type( json )
		switch( type ) {
			case 'Boolean' :
			case 'Null' :
			case 'Number' :
				return new $jin_tree2({
					type : String( json ) ,
					baseUri : baseUri
				})
			case 'String' :
				return new $jin_tree2({
					value : json ,
					baseUri : baseUri
				})
			case 'Array' :
				return new $jin_tree2({
					type : "list" ,
					childs : json.map( json => $jin_tree2.fromJSON( json , baseUri ) )
				})
			case 'Date' :
				return new $jin_tree2({
					type : "time" ,
					value : json.toISOString() ,
					baseUri : baseUri
				})
			case 'Object' :
				var childs = []
				for( var key in json ) {
					if( json[key] === undefined ) continue
					if( /^[^\n\t= ]+$/.test( key ) ) {
						var child = new $jin_tree2({
							type : key ,
							baseUri : baseUri
						})
					} else {
						var child = new $jin_tree2({
							value : key ,
							baseUri : baseUri
						})
					}
					child.childs.push( new $jin_tree2({
						type : ":" ,
						childs : [ $jin_tree2.fromJSON( json[ key ] , baseUri ) ] ,
						baseUri : baseUri
					}) )
					childs.push( child )
				}
				return new $jin_tree2({
					type : "dict" ,
					childs : childs ,
					baseUri : baseUri
				})
			default:
				throw $jin2_error({
					reason : 'Unsupported type' ,
					type : type ,
					uri : baseUri
				});
		}
	}
	
	get uri() {
		return this.baseUri + '#' + this.row + ':' + this.col
	}
	
	toString( prefix = '' ) {
		var output = ''
		
		if( this.type.length ) {
			if( !prefix.length ) {
				prefix = "\t";
			}
			output += this.type + " "
			if( this.childs.length == 1 ) {
				return output + this.childs[0].toString( prefix )
			}
			output += "\n"
		} else if( this.data.length || prefix.length ) {
			output += "=" + this.data + "\n"
		}
		for( var child of this.childs ) {
			output += prefix
			output += child.toString( prefix + "\t" )
		}
		return output
	}
	
	toJSON( ) : any {
		if( !this.type ) return this.value
		
		if( this.type === '//' ) return undefined
		
		if( this.type === 'true' ) return true
		if( this.type === 'false' ) return false
		if( this.type === 'null' ) return null
		
		if( this.type === 'dict' ) {
			var obj = {}
			for( var child of this.childs ) {
				var key = child.type || child.value
				if( key === '//' ) continue
				var colon = child.select([ ':' ]).childs[0]
				if( !colon ) throw $jin2_error({
					reason : 'Syntax error',
					required : 'Colon after key',
					uri : child.uri
				})
				var val = colon.childs[0].toJSON()
				if( val !== undefined ) obj[ key ] = val
			}
			return obj
		}
		
		if( this.type === 'list' ) {
			var res = []
			this.childs.forEach( child => {
				var val = child.toJSON()
				if( val !== undefined ) res.push( val )
			} )
			return res
		}
		
		if( this.type === 'time'  ) {
			return new Date( this.value )
		}
		
		if( String( Number( this.type ) ) == this.type ) return Number( this.type )
		
		throw $jin2_error({
			reason : 'Unknown type' ,
			type : this.type
		})
	}
	
	get value() {
		var  values = []
		for( var child of this.childs ) {
			if( child.type ) continue
			values.push( child.value )
		}
		return this.data + values.join( "\n" )
	}
	
	select( path : string[] | string ) {
		if( typeof path === 'string' ) path = (<string>path).split( / +/ )
		
		var next = [ this ]
		for( var type of path ) {
			if( !next.length ) break
			var prev = next
			next = []
			for( var item of prev ) {
				for( var child of item.childs ) {
					if( child.type == type ) {
						next.push( child )
					}
				}
			}
		}
		return new $jin_tree2({ childs : next })
	}
	
	filter( path : string[] | string , value? : string ) {
		if( typeof path === 'string' ) path = (<string>path).split( / +/ )
		
		var childs = this.childs.filter( function( item ){
			
			var found= item.select( path )
			
			if( value == null ){
				return Boolean( found.childs.length )
			} else {
				return found.childs.some( child => child.value == value )
			}
		})
		
		return new $jin_tree2({ childs : childs })
	}
	
}
