var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, router = {};

var userSchema = function ( data ) {
	var d = {
		name: data.name
		, phone: data.phone
		, email: data.email
		, admin: !!data.admin
		, stocks: []
	};

	if ( data.password ) {
		d.password = data.password;
	}

	return d;
};

router.getLogin = function ( req, res ) {
	if ( req.session.user_id ) {
		return res.redirect( '/home' );
	}

	return res.render( 'login', { title: 'Entrar - OmniSystem', loginPage: true } );
};

router.getRegister = function ( req, res ) {
	if ( req.session.user_id ) {
		return res.redirect( '/home' );
	}

	return res.render( 'register', { title: 'Cadastrar - OmniSystem', loginPage: true } );
};

router.postLogin = function ( req, res ) {
	db.bind( 'users' );
	db.users.findOne( { email: req.body.email, password: req.body.password }, function ( err, user ) {
		console.log( user );
		if ( user ) {
			req.session.user_id = user._id;
			return res.redirect( '/home' );
		} else {
			return res.redirect( '/login' );
		}
	});
};

router.postRegister = function ( req, res ) {
	db.bind( 'users' );
	var user = userSchema( req.body );
	db.users.insert( user, function ( err, item ) {
		return res.redirect( '/login' );
		console.log( item.ops[ 0 ] );
	});

	return res.json( { success: true } );
};

router.getIndex = function ( req, res ) {
	if ( !req.app.locals.User || !req.app.locals.User.admin ) {
		return res.redirect( '/login' );
	}

	db.bind( 'users' );
	db.users.find().toArray( function ( err, users ) {
		return res.render( 'users/list', { title: 'Usuários - OmniSystem', users: users } );
	});
};

router.getEdit = function ( req, res ) {
	db.bind( 'users' );
	db.users.findById( req.params.id, function ( err, user ) {
		return res.render( 'users/form', { title: 'Novo usuário', user: user } );
	});
};

router.postEdit = function ( req, res ) {
	if ( !req.body.name ) {
		return res.redirect( '/cliente/'+ req.params.id );
	}

	db.bind( 'users' );
	db.users.update( 
		{ _id: mongo.helper.toObjectID( req.body._id ) }
		, { $set: userSchema( req.body ) }
		, function ( err, result ) {
			return res.redirect( '/usuarios' );
		}
	);
};

router.getDelete = function ( req, res ) {
	db.bind( 'users' );
	db.users.removeById( req.params.id );
};

router.getLogout = function ( req, res ) {
	delete req.session.user_id;
	return res.redirect( '/login' );
};

module.exports = router;