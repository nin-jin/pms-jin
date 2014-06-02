/**
 * @name $jin.state.url
 * @class $jin.state.url
 * @returns $jin.state.url
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.state.url': [] })

$jin.atom.prop( '$jin.state.url.href',
{   pull: function( ){
        return document.location.href
    }
,   put: String
} )

$jin.atom.prop( '$jin.state.url.hash',
{   pull: function( ){
        return $jin.uri.query( $jin.uri.parse( this.href() ).hash() ).raw()
    }
} )

$jin.atom.prop( '$jin.state.url.listener',
{   pull: function( ){
        return setInterval( function( ){
            $jin.state.url.href_atom().pull()
        }, 50 )
    }
} )

$jin.atom.prop.hash( '$jin.state.url.item',
{   pull: function( key ){
        this.listener()
        var val = this.hash()[ key ]
        return ( val == null ) ? null : val
    }
,   put: function( key, value ){
        var hash = this.hash()
        
        if( value == null ) delete hash[ key ]
        else hash[ key ] = value
        
        document.location = '#' + $jin.uri.query( hash ).toString( ';=' )
    }
} )
