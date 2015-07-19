class User extends $jin.model<any> {
    static objectId = $jin.model.classRegister( 'User' )

    get login() {
        return new $jin.atom.prop<string,User>({
            pull : prev => 'anonimous'
        })
    }

}

var newUserName = new $jin.atom.prop({
    pull : () => {
        var user1 = new User({ })
        return user1.login.get()
    },
    reap: () => null
}).get()

class UserNext extends $jin.model<any> {
    static objectId = $jin.model.classRegister( 'User' )

    get login() {
        return new $jin.atom.prop<string,UserNext>({
            pull : prev => 'user_' + this.objectId
        })
    }

}

eval('User = UserNext')
