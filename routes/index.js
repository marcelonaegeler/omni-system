var express = require( 'express' )
	, router = express.Router()
	, controller = require( '../controllers/UserController' )
	, auth = require( '../controllers/AuthController' )
	;

router.get( '/home', auth.isLogged, function ( req, res ) {
	return res.render( 'index', { title: 'OmniSystem' } );
});

router.get( '/login', controller.getLogin );
router.get( '/logout', controller.getLogout );
router.get( '/cadastrar', controller.getRegister );
router.get( '/usuarios/excluir/:id', auth.isLogged, controller.getDelete );

router.post( '/authenticate', controller.postLogin );
router.post( '/register', controller.postRegister );

module.exports = router;