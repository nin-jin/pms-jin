class User extends $jin.model {
    static objectPath = $jin.model.classRegister( 'User' )

    get name() {
        return new $jin.atom2.transit<string>({
            pull : prev => 'Man ' + this.objectPath
        })
    }

    get age() {
        return new $jin.atom2.transit<number>({
            pull : prev => 35
        })
    }

}

new $jin.atom2.transit({
    pull : () => {
        var user1 = new User
        var user2 = new User
        console.log( user1.name.get(), user1.age.get() )
        console.log( user2.name.get(), user2.age.get() )
    }
}).pull()

class UserNext extends $jin.model {
    static objectPath = $jin.model.classRegister( 'User' )

    get name() {
        return new $jin.atom2.transit<string>({
            pull : prev => 'Man ' + this.objectPath
        })
    }

    get age() {
        return new $jin.atom2.transit<number>({
            pull : prev => Math.round( Math.random() * 50 )
        })
    }
}

eval('User = UserNext')
