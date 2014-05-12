/**
 * Выдаёт сообщение пользователю и ждет от него подтверждения. В отличие от window.alert работает в различных окружениях.
 *
 * @name $jin.alert
 * @method alert
 * @param {string} message
 * @static
 * @member $jin
 */
$jin.method({ '$jin.alert': function( message ){
	alert( message )
}})
