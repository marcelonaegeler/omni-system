var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, routes = {}
	;

var productSchema = function ( data ) {
	return {
		code: data.code
		, name: data.name
		, points: +data.points
		, price_final: +data.price_final
		, price_20: +data.price_20
		, price_25: +data.price_25
		, price_30: +data.price_30
		, price_35: +data.price_35
		, price_40: +data.price_40
		, price_50: +data.price_50

		, created_at: data.created_at || new Date()
		, edited_at: new Date()
	};
};

routes.getIndex = function ( req, res ) {
	db.bind( 'products' );

	db.products.find().toArray( function ( err, items ) {
		return res.render( 'products/list', { title: 'Produtos - OmniSystem', products: items } );
	});
};

routes.getNew = function ( req, res ) {
	return res.render( 'products/form', { title: 'Novo produto - OmniSystem' } );
};

routes.getEdit = function ( req, res ) {
	db.bind( 'products' );
	db.products.findById( req.params.id, function ( err, item ) {
		return res.render( 'products/form', { title: 'Editar produto - OmniSystem', product: item } );
	});
};

routes.postSaveNew = function ( req, res ) {
	db.bind( 'products' );
	db.products.insert( productSchema( req.body ) );

	return res.redirect( '/produtos' );
};

routes.postSaveEdit = function ( req, res ) {
	db.bind( 'products' );
	db.products.update( 
		{ _id: mongo.helper.toObjectID( req.body._id ) }
		, productSchema( req.body )
		, function ( err, result ) {
			return res.redirect( '/produtos' );
		}
	);
};


module.exports = routes;