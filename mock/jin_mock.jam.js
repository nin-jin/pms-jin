/**
 * @name $jin.mock
 * @class $jin.mock
 * @returns $jin.mock
 * @mixins $jin.klass
 */
$jin.klass({ '$jin.mock': [] })

/**
 * @name $jin.mock#path
 * @method path
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..path': String })

/**
 * @name $jin.mock#ownerPath
 * @method ownerPath
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..ownerPath': function( ){
	return this.path().replace( /\.[^.]*$/, '' )
}})

/**
 * @name $jin.mock#fieldName
 * @method fieldName
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..fieldName': function(){
	return this.path().replace( /^.*\./, '' )
}})

/**
 * @name $jin.mock#value
 * @method value
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..value': null })

/**
 * @name $jin.mock#backupValue
 * @method backupValue
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..backupValue': null })

/**
 * @name $jin.mock#backupOwner
 * @method backupOwner
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..backupOwner': null })

/**
 * @name $jin.mock#mocking
 * @method mocking
 * @member $jin.mock
 */
$jin.property({ '$jin.mock..mocking': function( mocking ){
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
}})

/**
 * @name $jin.mock#destroy
 * @method destroy
 * @member $jin.mock
 */
$jin.method({ '$jin.mock..destroy': function( ){
    this.mocking( false )
    this['$jin.klass..destroy']()
}})
