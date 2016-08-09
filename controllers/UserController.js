var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, router = {};

var userSchema = function ( data ) {
	return {
		name: data.name
		, phone: data.phone
		, email: data.email
		, admin: data.admin
		, password: data.password
	};
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
		console.log( item );
	});

	return res.json( { success: true } );
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