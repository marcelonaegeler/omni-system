var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, async = require( 'async' )
	, routes = {}
	;

var stockSchema = function ( data ) {
	var d = {
		product_id: data.product_id
		, quantity: data.quantity
		, price: data.price
		, edited_at: new Date()
	};

	if ( !data ) {
		d.created_at = new Date();
	}
	return d;
};


routes.getIndex = function ( req, res ) {
	return res.render( 'stock/list', { title: 'Estoque' } );
};

routes.getAdd = function ( req, res ) {

	db.bind( 'products' );
	db.products.find().toArray( function ( err, items ) {
		return res.render( 'stock/form', { title: 'Adicionar estoque', products: items } );
	});
};


module.exports = routes;