var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, async = require( 'async' )
	, routes = {}
	;

var clientSchema = function ( data ) {
	var d = {
		name: data.name
		, phone: data.phone
		, address: data.address
		, height: +data.height
		, weight: +data.weight
		, information: data.information
		, edited_at: new Date()
		, interests: data.interests || []
		, user_id: data.user_id
	};

	if ( !data ) {
		d.created_at = new Date();
	}

	return d;
};

routes.getIndex = function ( req, res ) {
	db.bind( 'clients' );

	db.clients.find({ user_id: req.session.user_id }).toArray( function ( err, items ) {
		return res.render( 'clients/list', { title: 'Clientes', clients: items } );
	});
};

routes.getNew = function ( req, res ) {
	db.bind( 'products' );
	db.products.find().toArray( function ( err, products ) {
		return res.render( 'clients/form', { title: 'Novo cliente', products: products } );
	});
};

routes.getEdit = function ( req, res ) {

	var getClient = function ( id, callback ) {
		db.bind( 'clients' );
		db.clients.findById( id, callback );
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
			return res.render( 'clients/form', { title: 'Editar cliente', client: results.client, products: results.products } );
		}
	);

	
};

routes.getDelete = function ( req, res ) {
	db.bind( 'clients' );
	db.clients.removeById( req.params.id );
	
	return res.redirect( '/clientes' );
};


routes.postNew = function ( req, res ) {
	if ( !req.body.name ) {
		return res.redirect( '/clientes/novo' );
	}

	db.bind( 'clients' );
	req.body.user_id = req.session.user_id;
	
	db.clients.insert( clientSchema( req.body ) );

	return res.redirect( '/clientes' );
};

routes.postEdit = function ( req, res ) {
	if ( !req.body.name ) {
		return res.redirect( '/cliente/'+ req.params.id );
	}

	req.body.user_id = req.session.user_id;
	
	db.bind( 'clients' );
	db.clients.update( 
		{ _id: mongo.helper.toObjectID( req.body._id ) }
		, clientSchema( req.body )
		, function ( err, result ) {
			return res.redirect( '/clientes' );
		}
	);
};

module.exports = routes;