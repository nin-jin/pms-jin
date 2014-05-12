/**
 * Запускает функцию в волокне. Если мы уже находимся в волокне, то просто запускает функцию.
 *
 * Используется как правило, для запуска приложения в волокне, чтобы внутри можно было свободно использовать псевдосинхронные функции,
 * которые приостанавливают волокно до завершения асинхронных операций.
 *
 * @name $jin.application
 * @method application
 * @param {function} func
 * @returns {function}
 * @static
 * @member $jin
 */
$jin.method({ '$jin.application': function( app, done ){
    return $jin.sync2async( app ).call( $jin.root(), done )
}})
