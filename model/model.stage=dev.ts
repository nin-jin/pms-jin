class User extends $jin.model {
    static objectPath = $jin.model.classRegister( 'User' )

    get name() {
        return new $jin.atom.prop<string>({
            pull : prev => 'Anonimous'
        })
    }

}

var newUserName = new $jin.atom.prop({
    pull : () => {
        var user1 = new User
        return user1.name.get()
    },
    notify : next => {
        console.log( next )
    },
    reap: () => null
}).get()

class UserNext extends $jin.model {
    static objectPath = $jin.model.classRegister( 'User' )

    get name() {
        return new $jin.atom.prop<string>({
            pull : prev => 'User ' + this.objectPath
        })
    }

}

eval('User = UserNext')
