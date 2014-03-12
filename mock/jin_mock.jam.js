$jin.klass({ '$jin.mock': [] })

$jin.property( '$jin.mock..path', String )
$jin.property( '$jin.mock..ownerPath', function(){
	return this.path().replace( /\.[^.]*$/, '' )
} )
$jin.property( '$jin.mock..fieldName', function(){
	return this.path().replace( /^.*\./, '' )
} )

$jin.property( '$jin.mock..value', null )
$jin.property( '$jin.mock..backupValue', null )
$jin.property( '$jin.mock..backupOwner', null )

$jin.property( '$jin.mock..mocking', function( mocking ){
    var fieldName = this.fieldName()
    if( mocking ){
		var owner =  $jin.trait( this.ownerPath() )
		this.backupOwner( owner )
        this.backupValue( owner[ fieldName ] )
        owner[ fieldName ] = this.value()
    } else {
		var owner = this.backupOwner()
        owner[ fieldName ] = this.backupValue()
        this.backupOwner( null )
        this.backupValue( null )
    }
    return mocking
} )

$jin.method( '$jin.klass..destroy', '$jin.mock..destroy', function( ){
    this.mocking( false )
    this['$jin.klass..destroy']()
} )
