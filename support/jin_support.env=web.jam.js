/**
 * @name $jin.support.xmlModel
 * @method xmlModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.xmlModel': function( ){
    return ( window.DOMParser && window.XMLSerializer && window.XSLTProcessor ) ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.htmlModel
 * @method htmlModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.htmlModel': function( ){
    return document.createElement( 'html:div' ).namespaceURI !== void 0 ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.eventModel
 * @method eventModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.eventModel': function( ){
    return ( 'addEventListener' in document.createElement( 'div' ) ) ? 'w3c' : 'ms'
}})

/**
 * @name $jin.support.textModel
 * @method textModel
 * @static
 * @member $jin.support
 */
$jin.property({ '$jin.support.textModel': function( ){
    return ( 'createRange' in document ) ? 'w3c' : 'ms'
}})
