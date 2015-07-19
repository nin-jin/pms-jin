module $jin {
    export declare function request( options : {
        uri : string
        method? : string
        sync? : boolean
        type? : string
        headers? : { [index : string ] : string[] }
        body? : any
    }) : any
}