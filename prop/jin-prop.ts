module $jin {

    /**
     * Простейшее свойство, поведение которого можно уточнять коллбэками при создании.
     * Допустим в классе User объявлено свойство name:
     *
     *   class Obj {
     *     name( ) { return $jin.prop.define( this, '_name', {
     *         merge : ( next : number, prev : number )
     *         => ( next.toString() === prev.toString() ) ? prev : next
     *     })}
     *   }
     *
     * тогда:
     *
     *   var user = new User;
     *   user.name().get() // получить значение, если сохранено исключение, то оно будет брошено, если значения нет - вычислить
     *   user.name().pull() // перевычислить значение
     *   user.name().set( next ) // предложить новое значение
     *   user.name().push() // установить значение
     *   user.name().fail( error ) // установить исключение, значение и исключение взаимоисключающи
     *   user.name().clear() // очистить свойство
     *   user.name().value() // возвращает сохранённое значение как есть
     *   user.name().error() // возвращает сохранённое исключение как есть
     *
     * Возможные колбэки:
     * 
     *   get( value ) - вызывается при каждом запросе значения, возвращает результат
     *   pull - вызывается если значение не определено, сохраняет нормализованный результат
     *   merge - нормализует значение новое значение на основе старого
     *   put - вызывается при set после нормализации и если новое значение отлично от старого
     *   notify - вызывается сразу после изменения значения
     *   fail - вызывается сразу после установки нового исключения
     *   clear - вызывается при очистке свойства
     */
    export class prop<ValueType,HostType> {
        
        static define<ValueType,HostType>( host : HostType, field : string, config : {
            get? : ( value : ValueType ) => ValueType;
            pull? : ( prev : ValueType ) => ValueType;
            merge? : ( next : ValueType, prev : ValueType ) => ValueType;
            put? : ( next : ValueType, prev : ValueType ) => void;
            notify? : ( next : ValueType, prev : ValueType ) => void;
            fail? : ( error : Error, prev : ValueType ) => void;
            clear? : ( prev : ValueType ) => void;
        } ) : $jin.prop<ValueType,HostType> {
            var prop = <$jin.prop<ValueType,HostType>> host[ field ];
            if( prop ) return prop;
            var prop = host[ field ] = <$jin.prop<ValueType,HostType>> new this({
                name : host.toString() + '..' + field,
                get : config.get,
                pull : config.pull,
                merge : config.merge,
                put : config.put,
                notify : config.notify,
                fail : config.fail,
                clear : config.clear || ( ( prev : ValueType ) => host[ field ] = null )
            })
            return prop;
        }
        
        constructor( config : {
            name : string;
            get? : ( value : ValueType ) => ValueType;
            pull? : ( prev : ValueType ) => ValueType;
            merge? : ( next : ValueType, prev : ValueType ) => ValueType;
            put? : ( next : ValueType, prev : ValueType ) => void;
            notify? : ( next : ValueType, prev : ValueType ) => void;
            fail? : ( error : Error, prev : ValueType ) => void;
            clear? : ( prev : ValueType ) => void;
        }) {
            this._name = config.name;
            if( config.get ) this._get = config.get;
            if( config.pull ) this._pull = config.pull;
            if( config.merge ) this._merge = config.merge;
            if( config.put ) this._put = config.put;
            if( config.notify ) this._notify = config.notify;
            if( config.fail ) this._fail = config.fail;
            if( config.clear ) this._clear = config.clear;
        }

        private _name : string;
        private _value : ValueType;
        private _error : Error;
        private _get( value : ValueType ) {
            return value;
        }
        private _pull( prev : ValueType ) {
            return prev;
        }
        private _merge( next : ValueType, prev : ValueType ) {
            return next;
        }
        private _put( next : ValueType, prev : ValueType ) { }
        private _notify( next : ValueType, prev : ValueType ) { }
        private _fail( error : Error, prev : ValueType ) { }
        private _clear( prev : ValueType ) { }
        
        get( ) : ValueType {
            if( this._value === undefined ) this.pull();
            return this._get( this._value );
        }
        pull( ) {
            this.push( this._pull( this._value ) );
        }
        set( next : ValueType ) {
            var prev = this._value;
            next = this._merge( next, prev );
            if( next != prev ) {
                this._put( next, prev );
            }
        }
        push( next : ValueType ) {
            var prev = this._value;
            next = this._merge( next, prev );
            if(( next != prev )||( this._error )){
                this._value = next;
                this._error = null;
                this.notify( next, prev );
            }
        }
        notify( next : ValueType, prev : ValueType ){
            this._notify( next, prev );
        }
        fail( error : Error ){
            if( error !== this._error ){
                this._error = error;
                var prev = this._value;
                this._value = null;
                this._fail( error, prev );
            }
        }
        clear( ){
            this._clear( this._value );
            this._value = null;
        }
    }

}
