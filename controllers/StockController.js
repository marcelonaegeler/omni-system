var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, async = require( 'async' )
	, routes = {}
	;

var stockSchema = function ( data ) {
	var d = {
		product_id: data.product_id
		, user_id: data.user_id
		, quantity: +data.quantity
		, price: +data.price
		, created_at: new Date()
		, edited_at: new Date()
	};
	
	return d;
};


routes.getIndex = function ( req, res ) {
	db.bind( 'stocks' );
	
	db.stocks.aggregate([
		{ $match: { user_id: req.session.user_id } }
		, { $lookup: {
				from: 'products',
				localField: '_id',
				foreignField: 'product_id',
				as: 'product_info'
		} }
	], function ( err, items ) {
		console.log( err, items );
		return res.render( 'stock/list', { title: 'Estoque', stocks: items } );
	});

};

routes.getAdd = function ( req, res ) {

	db.bind( 'products' );
	db.products.find().toArray( function ( err, items ) {
		return res.render( 'stock/form', { title: 'Adicionar estoque', products: items } );
	});
};

routes.getEdit = function ( req, res ) {

	db.bind( 'products' );
	db.products.find().toArray( function ( err, items ) {
		return res.render( 'stock/form', { title: 'Adicionar estoque', products: items } );
	});
};

routes.postSave = function ( req, res ) {
	if ( !req.session.user_id ) {
		return res.redirect( '/login' );
	}
	var d = req.body;
	d.user_id = req.session.user_id;
	
	db.bind( 'stocks' );
	db.stocks.insert( stockSchema( d ), function () {
		return res.redirect( '/estoque' );
	});
};

routes.postEdit = function ( req, res ) {
	
};


module.exports = routes;