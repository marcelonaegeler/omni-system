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
			return res.redirect( '/login' );
		}
		req.app.locals.user = user;

		return next();
	});
 
};

module.exports = Auth;