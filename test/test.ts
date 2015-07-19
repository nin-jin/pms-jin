declare module $jin {
    interface testClass {
        timeout( period : number );
        done( value : boolean );
        fail( );
        ok<Type>( value : Type );
        not<Type>( value : Type );
        equal<Type>( left : Type , right : Type );
        unique<Type>( left : Type , right : Type );
        callback( handler : () => void );
        mock<Type>( path : string , value : Type );
    }
    export function test ( script : ( test : testClass ) => void ) : void
    export function test ( config : { [ index: string ] : ( test : testClass ) => void } ) : void
}
