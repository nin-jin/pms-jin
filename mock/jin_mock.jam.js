$jin.klass({ '$jin.mock': [] })

$jin.property( '$jin.mock..name', String )
$jin.property( '$jin.mock..value', null )
$jin.property( '$jin.mock..backup', null )

$jin.property( '$jin.mock..mocking', function( mocking ){
    var name = this.name()
    if( mocking ){
        this.backup( $jin.glob( name ) )
        $jin.glob( name, this.value() )
    } else {
        $jin.glob( name, this.backup() )
        this.backup( void 0 )
    }
    return mocking
} )

$jin.method( '$jin.klass..destroy', '$jin.mock..destroy', function( ){
    this.mocking( false )
    this['$jin.klass..destroy']()
} )
