module $jin.atom {

    export class status extends $jin.enumeration {
        static clear = new status( 'clear' )
        static pull = new status( 'pull' )
        static actual = new status( 'actual' )
        static error = new status( 'error' )
        static destroyed = new status( 'destroyed' )
    }
}
