module $jin.prop.test {

    $jin.test( test => {
        var atom1 = new $jin.atom.prop<number,any>({
            pull : prev => 0
        })
        var atom2 = new $jin.atom.prop<number,any>({
            pull : prev => atom1.get() + 111
        })
        var atom3 = new $jin.atom.prop<number,any>({
            pull : prev => atom2.get() + 333
        })

        test.equal( atom3.get(), 444 )
        test.equal( atom2.get(), 111 )

        atom1.push( 666 )
        test.equal( atom3.get(), 444 )
        test.equal( atom2.get(), 777 )
        test.equal( atom3.get(), 1110 )
    } )

    class AtomTriplet extends $jin.object<any> {
        get value1( ) {
            return new $jin.atom.prop<number,AtomTriplet>( {
                owner : this,
                name : '_value1'
            } )
        }
        get value2( ) {
            return new $jin.atom.prop<number,AtomTriplet>( {
                owner : this,
                name : '_value2',
                pull : atom => this.value1.get() + 111
            } )
        }
        get value3( ) {
            return new $jin.atom.prop<number,AtomTriplet>( {
                owner : this,
                name : '_value3',
                pull : atom => this.value1.get() && this.value2.get()
            } )
        }
    }

    $jin.test( test => {
        var obj = new AtomTriplet({})
        test.equal( obj.value1, obj.value1 )
        test.unique( obj.value1, obj.value2 )
        obj.value1.push( 666 )
        test.equal( obj.value2.get(), 777 )
    } )

    $jin.test( test => {
        var log = []

        var source = new $jin.atom.prop<number,any>({})

        var target = source.then( value => {
            log.push( 'then:' + value )
            return value + 111
        } )

        target.then( value => log.push( 'and:' + value ) )

        log.push( 'end' )

        setTimeout( () => {
            test.equal( log.join( ';' ), 'end;then:666;and:777' )
            test.done( true )
        }, 0 )

        source.push( 666 )

        test.timeout( 100 )

    } )

}
