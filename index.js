var express = require( 'express' )
	, app = express()
	, bodyParser = require( 'body-parser' )
	, session = require( 'express-session' )
	, auth = require( './controllers/AuthController' )
	, port = process.env.PORT || 3000
	;

app.use( express.static( 'public' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.set( 'view engine', 'pug' );
app.set( 'views', './views' );
app.set( 'json spaces', 4 );

app.locals.basedir = __dirname + '/views';

app.use( session( { 
	secret: 'organização é sucesso'
	, cookie: { maxAge: ( 60000 * 60 * 24 ) } 
	, resave: false
	, saveUninitialized: false
}));

app.use( '/', require( './routes/index' ) );
app.use( '/produtos', auth.isLogged, require( './routes/products' ) );
app.use( '/clientes', auth.isLogged, require( './routes/clients' ) );
app.use( '/pedidos', auth.isLogged, require( './routes/orders' ) );
app.use( '/estoque', auth.isLogged, require( './routes/stock' ) );

var server = app.listen( port, function () {
	console.log( 'Listening on :'+ port );
});
