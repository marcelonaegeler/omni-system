var express = require( 'express' )
	, router = express.Router()
	, controller = require( '../controllers/UserController' )
	, auth = require( '../controllers/AuthController' )
	;


router.get( '/', function ( req, res ) {
	return res.render( 'homepage', { title: 'OmniSystem' } );
});

router.get( '/home', auth.isLogged, function ( req, res ) {
	return res.render( 'index', { title: 'OmniSystem' } );
});

router.get( '/login', controller.getLogin );
router.get( '/logout', controller.getLogout );
router.get( '/cadastrar', controller.getRegister );

router.post( '/authenticate', controller.postLogin );
router.post( '/register', controller.postRegister );

router.get( '/usuarios', auth.isLogged, auth.isAdmin, controller.getIndex );
router.get( '/usuarios/editar/:id', auth.isLogged, auth.isAdmin, controller.getEdit );
router.get( '/usuarios/excluir/:id', auth.isLogged, auth.isAdmin, controller.getDelete );

router.post( '/usuarios/edit', controller.postEdit );

module.exports = router;