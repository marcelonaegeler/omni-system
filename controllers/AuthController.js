var mongoskin = require( '../config_db' )
	, db = mongoskin.db
	, mongo = mongoskin.mongo
	, Auth = {};

Auth.isLogged = function ( req, res, next ) {
	if ( !req.session.user_id ) {
		return res.redirect( '/login' );
	}

	db.bind( 'users' );
	db.users.findById( req.session.user_id, function ( err, user ) {
		if ( !user || err ) {
			// delete req.app.locals.User;
			return res.redirect( '/login' );
		}
		req.app.locals.User = user;

		return next();
	});
};

Auth.isAdmin = function ( req, res, next ) {
	if ( !req.session.user_id ) {
		return res.redirect( '/login' );
	}

	db.bind( 'users' );
	db.users.findById( req.session.user_id, function ( err, user ) {
		if ( err || !user || !user.admin ) {
			return res.redirect( '/login' );
		}
		
		req.isAdmin = true;

		return next();
	});
};

module.exports = Auth;