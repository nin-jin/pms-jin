module $jin.prop.test {

    $jin.test( test => {
        var obj = new $jin.prop.vary<number,any>({})
        test.equal( obj.get(), undefined )
        obj.set( 777 )
        test.equal( obj.get(), 777 )
    } )

    class VarySimple extends $jin.object<any> {
        get value( ){
            return new $jin.prop.vary<number,VarySimple>({
                owner : this,
                name : '_value'
            })
        }
    }

    $jin.test( test => {
        var obj = new VarySimple({ })
        test.equal( obj.value.get(), undefined )
        obj.value.set( 777 )
        test.equal( obj.value.get(), 777 )
    } )

    class VaryLazy extends $jin.object<any> {
        defaultValue = 666
        get value( ){
            return new $jin.prop.vary<number,VaryLazy>({
                owner : this,
                name : '_value',
                pull : prop => this.defaultValue,
                merge: ( prop , next , prev ) => next + 111
            })
        }
    }

    $jin.test( test => {
        var obj = new VaryLazy({ })
        test.equal( obj.value.get(), 777 )
        obj.defaultValue = 555
        test.equal( obj.value.get(), 777 )
        obj.value.pull()
        test.equal( obj.value.get(), 666 )
        obj.value.set( 666 )
        test.equal( obj.value.get(), 888 )
        obj.value.clear()
        test.equal( obj.value.get(), 666 )
    } )

    class VaryShare extends $jin.object<any> {
        static sharedValue = 0
        get value( ){
            return new $jin.prop.vary<number,VaryShare>({
                owner : this,
                name : '_value',
                put : ( prop , next ) => VaryShare.sharedValue = next + .111,
                pull : prop => 666,
                get: ( prop , value ) => VaryShare.sharedValue + value
            })
        }
    }
    
    $jin.test( test => {
        var obj = new VaryShare({ })
        test.equal( obj.value.get(), 666 )
        obj.value.set( 111 )
        test.equal( obj.value.get(), 777.111 )
    } )

}
//
//declare module performance {
//    function now() : number;
//}
//
//class User1 {
//
//    get birthDay( ){
//        return new $jin.prop.vary<number>({
//            host : this,
//            field : '_birthDay',
//            pull : () => Date.now()
//        })
//    }
//    
//}
//
//class User2 {
//    _birthDay : number;
//    
//    constructor(){
//        this._birthDay = null
//    }
//    
//    get birthDay(){
//        var value = this._birthDay
//        if( value === null ){
//            value = this.birthDay = Date.now()
//        }
//        return value
//    }
//
//    set birthDay( next : number ){
//        this._birthDay = next
//    }
//
////    _name : string;
////    get name(){
////        return ( this._name === undefined ) ? 'unnamed' : this._name;
////    }
////    set name(next:string){
////        this._name = next
////    }
//}
//
//
//var N = 100000;
//
//setTimeout( test2 , 1000 )
//var users1 = []
//function test1(){
//    var start = performance.now();
//    var user = new User1;
//    for( var i = 0 ; i < N ; ++i ){
//        var u = new User1
//        users1.push( u )
//        user.birthDay.set( u.birthDay.get() + 1 );
//    }
//    console.log( 1 , performance.now() - start );
//    console.log( user.birthDay.get() )
//}
//var users2 = []
//function test2(){
//    var start = performance.now();
//    var user = new User2;
//    for( var i = 0 ; i < N ; ++i ){
//        var u = new User2
//        users2.push( u )
//        user.birthDay = u.birthDay + 1;
//    }
//    console.log( 2 , performance.now() - start );
//    console.log( user.birthDay )
//    setTimeout( test1 , 500 )
//}
