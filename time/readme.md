# $jin.time

Small, simple, powerfull, and fast TypeScript/JavaScript library for proper date/time/duration/range arithmetic.

**Deprecated. Use [$mol_time](https://github.com/eigenmethod/mol/tree/master/time) instead.**

# Installation

## Direct

```html
<script src="http://nin-jin.github.io/time/time2.js"></script>
<script>
	alert( $jin.time.moment() ) // alerts current time
</script>
```

Or get typescript sources from repository: https://github.com/nin-jin/pms-jin/tree/master/time

## NPM

```sh
npm install jin-time
```

```js
var time = require( 'jin-time' )
console.log( time.moment().toString() ) // logs current time
```

# Comparison

## Native Date

- instance is timestamp representation (forever have time and timezone)
- instance is mutable object
- inconsistent, poor api
- zero lib size, but very large client code
- fastest

Speed of iso8601 serialization:
```js
var m = new Date ; console.time('test') ; for( var i = 0 ; i < 100000 ; ++i ) m.toISOString() ; console.timeEnd('test')
// 150ms
```

Speed of iso8601 parsing:
```js
console.time('test') ; for( var i = 0 ; i < 10000 ; ++i ) new Date( '2015-07-20T07:48:28.338+03:00' ) ; console.timeEnd('test')
// 13ms
```

## MomentJS

- instance is wrapper around native Date instance
- instance is timestamp representation (forever have time and timezone)
- instance is mutable object
- large lib size (100kb core + plugins)
- slow
- too more specific features, but some basics supports only by plugins

Speed of iso8601 serialization:
```js
var m = moment() ; console.time('test') ; for( var i = 0 ; i < 100000 ; ++i ) t.toISOString() ; console.timeEnd('test')
// 470ms
```

Speed of iso8601 parsing:
```js
console.time('test') ; for( var i = 0 ; i < 10000 ; ++i ) moment( '2015-07-20T07:48:28.338+03:00' ) ; console.timeEnd('test')
// 440ms
```

## $jin.time

- all time components stores separately
- instance is immmutable object
- cool consistent core, but some needed features not implemented yet
- small lib size (35kb)
- fast

Speed of iso8601 serialization:
```js
var m = $jin.time.moment() ; console.time('test') ; for( var i = 0 ; i < 100000 ; ++i ) m.toString() ; console.timeEnd('test')
// 180ms
```

Speed of iso8601 parsing:
```js
console.time('test') ; for( var i = 0 ; i < 10000 ; ++i ) $jin.time.moment( '2015-07-20T07:48:28.338+03:00' ) ; console.timeEnd('test')
// 65ms
```

# API

## Moments

### Creating

```js
// current time in current time zone
$jin.time.moment()

// by timestamp
$jin.time.moment( 1437316165000 )

// by native Date
$jin.time.moment( new Date )

// by iso8601 string
$jin.time.moment( '2015-07-19T17:27:58.065+03:00' ) // full time
$jin.time.moment( '2015-07-19T17:27:58.065' ) // time without offset (non local!)
$jin.time.moment( '2015-07-19' ) // date without time (non 00:00:00)

// by components
$jin.time.moment({
	year : 2015 ,
	month : 6 , // 0 - January
	day : 18 , // 0 - first day of month
	hour : 17 ,
	minute : 27 ,
	second : 58.65 , // fractional, no property "millisecond"
	offset : { // this is $jin.time.duration
		hour : 3 ,
		minute : 0 ,
	} ,
})

// by list of components
$jin.time.moment([ 2015 , 6 , 18 , 17 , 27 , 58.65 , [ 3 , 0 ]])
```

### Getters

```js
// component value (undefined by default)
var moment = $jin.time.moment()
moment.year // number
moment.month // 0 .. 11
moment.day // 0 .. 30
moment.hour // 0 .. 23
moment.minute // 0 .. 59
moment.second // 0 .. 59 (fractional)
moment.offset // $jin.time.duration

// day of week
$jin.time.moment().weekDay // 0 - sunday , 6 - saturday

// timestamp
$jin.time.moment().valueOf() // Date.now()

// native Date
$jin.time.moment().native // new Date

// iso8601
$jin.time.moment().toString() // ( new Date ).toISOString()
$jin.time.moment().toJSON() // ( new Date ).toISOString()
```

### Arithmetic

```js
// create moment by normalize one
$jin.time.moment( '2015-07-35' ).normal // $jin.time.moment( '2015-08-04' )

// create moment by merge one moment with another
$jin.time.moment( '2015-07-19' ).merge({ month : 7 , day : 4 }) // $jin.time.moment( '2015-08-04' )

// create moment by shift one by duration
$jin.time.moment( '2015-07-19' ).shift( 'P16D' ) // $jin.time.moment( '2015-08-04' )

// create moment by shift one to offset
$jin.time.moment( '2015-07-19T19:24+03:00' ).toOffset( 'Z' ) // $jin.time.moment( '2015-07-19T16:24+00:00' )
```

### Serialization

```js
$jin.time.moment().toString( 'YYYY-MM-DD hh:mm (WeekDay)' ) // "2015-07-20 07:22 (Monday)"
```

Mnemonics:
- single letter for numbers: *M* - month number, *D* - day of month.
- uppercase letters for dates, lowercase for times: *M* - month number , *m* - minutes number
- repeated letters for define register count: *YYYY* - full year, *YY* - shot year, *MM* - padded month number
- words for word representation: *Month* - month name, *WeekDay* - day of week name
- shortcuts: *WD* - short day of week, *Mon* - short month name.

## Durations

### Creating

```js
 // zero duration
$jin.time.duration()

// by milliseconds count
$jin.time.duration( 60000 ) // 60 seconds (non 1 minute!)

// by iso8601 string
$jin.time.duration( 'P1Y2M3DT4H5M6.7S' ) // all components are optional
$jin.time.duration( 'PT' ) // zero duration

// by components
$jin.time.duration({
	year : 1 ,
	month : 2 ,
	day : 3 ,
	hour : 4 ,
	minute : 5 ,
	second : 6.7 ,
})

// by list of components
$jin.time.duration([ 1 , 2 , 3 , 4 , 5 , 6.7 ])
```

### Getters

```js
//component value (0 by default)
var dur = $jin.time.duration()
durdur.year // number
dur.month // number
dur.day // number
dur.hour // number
dur.minute // number
dur.second // number (fractional)

// duration in milliseconds
$jin.time.duration( 'PT1M' ).valueOf() // 60000

// iso8601
$jin.time.duration( 'PT1M0S' ).toString() // PT1M
$jin.time.duration( 'PT1M0S' ).toJSON() // PT1M
```

### Arithmetic

```js
// create duration as summ of one and another
$jin.time.duration( 'PT1h' ).summ( 'PT1h1m' ) // $jin.time.duration( 'PT2H2M' )

// create duration as substract of another from one
// attention! can produce negative values that is not compatible with iso8601
$jin.time.duration( 'PT1h' ).sub( 'PT1h1m' ) // $jin.time.duration( 'PT-1M' )
```

## Ranges

### Creating

```js
// by iso8601 string
$jin.time.range( '2015-07-19/2015-08-02' ) // by two moments
$jin.time.range( '2015-07-19/P14D' ) // by two start moment and duration
$jin.time.range( 'P14D/2015-08-02' ) // by two end moment and duration

// by components
$jin.time.range({
	start : '2015-07-19' ,
	end : '2015-08-02' ,
})
$jin.time.range({
	start : '2015-07-19' ,
	duration : 'P14D' ,
})
$jin.time.range({
	duration : 'P14D' ,
	end : '2015-08-02' ,
})

// by list of components
$jin.time.range([ '2015-07-19' , '2015-08-02' ])
$jin.time.range([ '2015-07-19' , null , 'P14D' ])
$jin.time.range([ null , '2015-08-02' , 'P14D' ])
```

### Getters

```js
// component value (third are calculated by defined two)
$jin.time.range( '2015/P1Y' ).end // $jin.time.moment( '2016' )
$jin.time.range( 'P1Y/2016' ).start // $jin.time.moment( '2015' )
$jin.time.range( '2015/2016' ).duration // $jin.time.duration( 'PT31536000S' )

// iso8601
$jin.time.range( '2015-01/P1M' ).toString() // '2015-01/P1MT'
$jin.time.range( '2015-01/P1M' ).toJSON() // '2015-01/P1MT'
```

## Localization

To add some language support use typescript subclassing:

```js
class moment_class_ru extends $jin.time.moment_class {
	static monthLong = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]
	static monthShort = [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ]
	static weekDayLong = [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота' ]
	static weekDayShort = [ 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ]
}
$jin.time.moment['ru'] = moment_class_ru.make.bind( moment_class_ru )
```

Then you can use it:

```js
$jin.time.moment['ru']().toString( 'YYYY-MM-DD (WD)' ) // "2015-07-20 (Пн)"
```

## To Do

 * Parsing by patterns
 * Repeating intervals support
 * Better localization
