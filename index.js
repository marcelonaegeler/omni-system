var express = require( 'express' )
	, app = express()
	, bodyParser = require( 'body-parser' )
	;

app.use( express.static( 'public' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.set( 'view engine', 'pug' );
app.set( 'views', './views' );
app.set( 'json spaces', 4 );

app.locals.basedir = __dirname + '/views';

app.use( '/', require( './routes/index' ) );
app.use( '/produtos', require( './routes/products' ) );
app.use( '/clientes', require( './routes/clients' ) );
app.use( '/pedidos', require( './routes/orders' ) );

var server = app.listen( 3000, function () {
	console.log( 'Listening on :3000' );
});
