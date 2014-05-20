/**
 * @name $jin.tree
 * @class $jin.tree
 * @returns $jin.tree
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.tree': [] })
    
/**
 * @name $jin.tree.parse
 * @method parse
 * @static
 * @member $jin.tree
 */
$jin.method({ '$jin.tree.parse': function( str, name ){
    content= []
    
    var stack= [ content ]
    var lines= String( str ).split( '\n' )
    
    for( var i= 0; i < lines.length; ++i ){
        var line= lines[ i ]
        var chunks= /^([ \t]*)([^=]*)(?:=([^\n]*))?$/.exec( line )
        
        if( !chunks ) continue
        
        var indent= chunks[ 1 ]
        var key= chunks[ 2 ]
        var value= chunks[ 3 ]
        
        stack.splice( 0, stack.length - indent.length - 1 )
        
        var keys= key.split( /\s+/ )
        var s= stack[ 0 ]
        
        for( var j= 0; j < keys.length; ++j ){
            var key= keys[ j ]
            if( !key ) continue
            
            var t= $jin.tree( [], key )
            s.push( t )
            s= t.content()
        }
        
        stack.unshift( s )
        
        if( value != null ) s.push( value )
    }
    
    return this( content, name )
}})

/**
 * @name $jin.tree#content
 * @method content
 * @member $jin.tree
 */
$jin.property({ '$jin.tree..content': null })

/**
 * @name $jin.tree#name
 * @method name
 * @member $jin.tree
 */
$jin.property({ '$jin.tree..name': String })

/**
 * @name $jin.tree#init
 * @method init
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..init': function( content, name ){
    this['$jin.klass..init']
    if( content instanceof this.constructor ) content = content.content()
    
    this.name( name )
    this.content( content )
}})

/**
 * @name $jin.tree#lines
 * @method lines
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..lines': function( ){
    
    var lines= [ ]
    this.content().forEach( function( value ){
        if( value && value.lines ){
            lines= lines.concat( value.lines().content() )
        } else {
            lines.push( '=' + value )
        }
    } )
    
    if( this.name() ){
        if( this.content().length > 1 ){
            lines= lines.map( function( line ){
                return '\t' + line
            })
            lines.unshift( this.name() )
        } else if( this.content().length > 0 ){
            lines[ 0 ]= this.name() + ' ' + lines[ 0 ]
        } else {
            lines[ 0 ]= this.name()
        }
    }
    
    return this.constructor.apply( this.constructor, [ lines ] )
}})

/**
 * @name $jin.tree#select
 * @method select
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..select': function( path ){
    return this.constructor.makePath( path )( this )
}})

/**
 * @name $jin.tree#filter
 * @method filter
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..filter': function( path, value ){
    var select= this.constructor.makePath( path )
    var content= this.content().filter( function( item ){
        if(!( item instanceof $jin.tree )) return false
        
        var found= select( item )
        
        if( value == null ){
            return Boolean( found.content().length )
        } else {
            return found.content().some( function( val ){
                return val == value
            })
        }
    })
    
    return $jin.tree( content )
}})

/**
 * @name $jin.tree#values
 * @method values
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..values': function( values ){
    if( arguments.length ){
        var args= [ 0, this.content().length ].concat( values )
        args.splice.apply( this.content(), args )
        return this
    }
    
    values= []
    
    this.content().forEach( function( val ){
        if( val instanceof $jin.tree ) return
        values.push( val )
    } )
    
    return values
}})

/**
 * @name $jin.tree#toString
 * @method toString
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..toString': function( ){
    return this.values().join( '\n' )
}})

/**
 * @name $jin.tree#inspect
 * @method inspect
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..inspect': function( ){
    return String( this.lines() )
}})

/**
 * @name $jin.tree#clone
 * @method clone
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..clone': function( ){
    return $jin.tree( this.content().slice( 0 ), this.name() )
}})

/**
 * @name $jin.tree#cloneAll
 * @method cloneAll
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..cloneAll': function( ){
    var content= this.content().map( function( item ){
        if( item instanceof $jin.tree ) return item.cloneAll()
        return item
    } )
    return $jin.tree( content, this.name() )
}})

/**
 * @name $jin.tree#toXML
 * @method toXML
 * @member $jin.tree
 */
$jin.method({ '$jin.tree..toXML': function( root ){
    if( !root ) root = $jin.dom.parse( '<tree/>' ).makeFragment()
    
    if( !this.name() ){
        this.content().forEach( function( val ){
            if( val instanceof $jin.tree ){
                val.toXML( root )
            } else {
                root.makeText( val || '\n' ).parent( root )
            }
        } )
    } else if( this.name() === '@' ){
        this.content().forEach( function( val ){
            if(!( val instanceof $jin.tree )) return
            if( val.content().length ){
                var content= $jin.tree( val.content() ).toXML()
            } else {
                var content= val.name()
            }
            root.attr( val.name(), content )
        } )
    } else if( this.name() === '?' ){
        this.content().forEach( function( val ){
            if(!( val instanceof $jin.tree )) return
            var content= []
            val.content().forEach( function( v ){
                if( v instanceof $jin.tree ){
                    content.push( v.name() + '="' )
                    content.push( $jin.tree( v.content() ).toXML() )
                    content.push( '"' )
                } else {
                    content.push( v )
                }
            } )
            root.makePI( val.name(), content.join( ' ' ) ).parent( root )
        } )
    } else {
        var el= root.makeElement( tree.name() ).parent( root )
        this.content().forEach( function( val ){
            if( val instanceof $jin.tree ){
                val.toXML( el )
            } else {
                el.makeText( val || '\n' ).parent( el )
            }
        })
    }
    return root
}})

$jin.tree.makePath = $jin.path( new function( ){
    
    this[ '' ]= function( name ){
        
        return function( tree ){
            var found= []
            tree.content().forEach( function( value ){
                if(!( value instanceof $jin.tree )) return
                if( value.name() !== name ) return
                
                found.push( value )
            })
            return $jin.tree( found )
        }
        
    }
    
    this[ '/' ]= function( name ){
        
        if( !name ) return function( tree ){
            var result= []
            tree.content().forEach( function( value ){
                if(!( value instanceof $jin.tree )) return
                
                result= result.concat( value.content() )
            })
            return $jin.tree( result )
        }
        
        return function( tree ){
            var found= []
            tree.content().forEach( function( value ){
                if(!( value instanceof $jin.tree )) return
                
                value.content().forEach( function( value ){
                    if(!( value instanceof $jin.tree )) return
                    if( value.name() !== name ) return
                    
                    found.push( value )
                })
            })
            return $jin.tree( found )
        }
        
    }
    
} )
