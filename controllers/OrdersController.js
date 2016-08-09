var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, Parse = require( '../helpers/Parse' )
	, Helpers = require( '../helpers/Helpers' )
	, async = require( 'async' )
	, routes = {}
	;

var orderSchema = function ( data ) {
	return {
		date_order: data.date_order
		, date_delivery: data.date_delivery
		, client: data.client
		, products: data.products
		, final_price: +data.final_price

		, created_at: data.created_at || new Date()
		, edited_at: new Date()
	};
};

routes.getIndex = function ( req, res ) {
	db.bind( 'orders' );

	db.orders.find().sort( { edited_at: -1 } ).toArray( function ( err, items ) {
		return res.render( 'orders/list', { title: 'Pedidos - OmniSystem', orders: items, Parse: Parse } );
	});
};

routes.getNew = function ( req, res ) {

	var getClient = function ( id, callback ) {
		db.bind( 'clients' );
		db.clients.findById( req.params.id, callback );
	};

	var getProducts = function ( callback ) {
		db.bind( 'products' );
		db.products.find().toArray( callback );
	};

	async.parallel(
		{
			client: async.apply( getClient, req.params.id )
			, products: getProducts
		}
		, function ( err, results ) {

			var today = Parse.dateToString( new Date() );
			return res.render( 'orders/form', { title: 'Novo pedido - OmniSystem', client: results.client, products: results.products, today: today, Helpers: Helpers } );
		}
	);

};

routes.getEdit = function ( req, res ) {

	var getOrder = function ( id, callback ) {
		db.bind( 'orders' );
		db.orders.findById( req.params.id, callback );
	};

	var getProducts = function ( callback ) {
		db.bind( 'products' );
		db.products.find().toArray( callback );
	};

	async.parallel(
		{
			order: async.apply( getOrder, req.params.id )
			, products: getProducts
		}
		, function ( err, results ) {
			var orderProducts = Helpers.mergeById( results.order.products, results.products );

			return res.render( 'orders/form', { title: 'Editar Pedido - OmniSystem', order: results.order, client: results.order.client, products: results.products, Helpers: Helpers } );
		}
	);
};

routes.getDelete = function ( req, res ) {
	db.bind( 'orders' );
	db.orders.removeById( req.params.id );
	
	return res.redirect( '/pedidos' );
};


routes.postNew = function ( req, res ) {

	var products = [];
	if ( req.body.quantity.length && req.body.product_id.length ) {
		var q = req.body.quantity;
		var p = req.body.product_id;
		for ( var i = 0, l = q.length; i < l; i++ ) {
			products.push({
				_id: p[ i ]
				, quantity: +q[ i ]
			});
		}
	}

	data = req.body;
	data.products = products;

	db.bind( 'clients' );
	db.clients.findById( data.client_id, function ( err, client ) {
		data.client = client;

		db.bind( 'orders' );
		db.orders.insert( orderSchema( data ) );

		return res.redirect( '/pedidos' );
	});
	
};

routes.postEdit = function ( req, res ) {
	
	var products = [];
	if ( req.body.quantity.length && req.body.product_id.length ) {
		var q = req.body.quantity;
		var p = req.body.product_id;
		for ( var i = 0, l = q.length; i < l; i++ ) {
			products.push({
				_id: p[ i ]
				, quantity: +q[ i ]
			});
		}
	}
	
	data = req.body;
	data.products = products;

	db.bind( 'clients' );
	db.clients.findById( data.client_id, function ( err, client ) {
		data.client = client;

		db.bind( 'orders' );
		db.orders.update( 
			{ _id: mongo.helper.toObjectID( req.body._id ) }
			, orderSchema( data )
			, function ( err, result ) {
				return res.redirect( '/pedidos' );
			}
		);
	});
};

module.exports = routes;