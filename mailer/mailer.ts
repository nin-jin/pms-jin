module $jin {
    export class mailer extends $jin.object<any> {
        
        uri : any
        
        constructor( uri ) {
            this.uri = $jin.uri.parse( uri )
            super({})
        }

        Driver( ) {
            return new $jin.prop.vary<any,$jin.mailer>({
                owner : this,
                name : 'driver',
                pull : prop => {
                    var scheme = this.uri.scheme()
                    var auth = {
                        user: this.uri.login(),
                        pass: this.uri.password()
                    }
                    var config : any
                    if( scheme === 'smtp' ) {
                        config = $node['nodemailer-smtp-transport']({
                            host: this.uri.host(),
                            tls: {
                                rejectUnauthorized: false
                            },
                            auth: auth
                        })
                    } else {
                        config = {
                            service: scheme,
                            auth: auth,
                        }
                    }
                    $jin.log.info( 'mail config' , config )
                    return $node.nodemailer.createTransport( config )
                }
            })
        }

        send( config : {
            from? : string
            to : string
            subject : string
            html? : string
            text? : string
			then? : ( any ) => any
        } ) {
            if( !config.from ) config.from = this.uri.login()
            var driver = this.Driver().get()
            var send = $jin.async2sync( driver.sendMail )
            if ($jin.param('verbose')) $jin.log.info('Send mail', config)
			return config.then
				? $jin.sync2async( send ).call( driver , config , config.then )
				: send.call( driver , config )
        }
        
    }
}
