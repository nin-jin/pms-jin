/**
 * @name $jin.field
 * @class $jin.field
 * @mixins $jin.klass
 * @mixins $jin.view1
 * @returns $jin.field
 */
$jin.klass({ '$jin.field': [ '$jin.view1' ] })

/**
 * @name $jin.field#label
 * @method label
 * @member $jin.field
 */
$jin.atom1.prop({ '$jin.field..label': {} })

/**
 * @name $jin.field#valueProp
 * @method valueProp
 * @member $jin.field
 */
$jin.atom1.prop({ '$jin.field..valueProp': {} })

/**
 * @name $jin.field#editor
 * @method editor
 * @member $jin.field
 */
$jin.atom1.prop({ '$jin.field..editor': {
	pull: function( ){
		return [ this.child( 'editor', $jin.editor ).valueProp( this.valueProp() ) ]
	}
}})

/**
 * @name $jin.field#focus
 * @method focus
 * @member $jin.field
 */
$jin.method({ '$jin.field..focus': function( ){
	this.child( 'editor' ).focus()
}})

