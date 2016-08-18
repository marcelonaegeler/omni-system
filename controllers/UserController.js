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
		console.log( item.ops[ 0 ] );
		return res.redirect( '/login' );
	});
};

router.getIndex = function ( req, res ) {
	if ( !req.app.locals.User || !req.app.locals.User.admin ) {
		return res.redirect( '/login' );
	}

	db.bind( 'users' );
	db.users.find().toArray( function ( err, users ) {
		return res.render( 'users/list', { title: 'Usuários', users: users } );
	});
};

router.getEdit = function ( req, res ) {
	db.bind( 'users' );
	db.users.findById( req.params.id, function ( err, user ) {
		return res.render( 'users/form', { title: 'Editar usuário', user: user, isAdmin: req.isAdmin } );
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
	return res.redirect( '/usuarios' );
};

router.getLogout = function ( req, res ) {
	delete req.session.user_id;
	return res.redirect( '/login' );
};

router.getMyAccount = function ( req, res ) {
	db.bind( 'users' );
	db.users.findById( req.session.user_id, function ( err, user ) {
		return res.render( 'users/form', { title: 'Minha conta', user: user, myAccount: true } );
	});
};

module.exports = router;