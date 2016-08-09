var express = require( 'express' )
	, router = express.Router()
	, controller = require( '../controllers/ClientsController' )
	;


router.get( '/', controller.getIndex );
router.get( '/novo', controller.getNew );
router.get( '/editar/:id', controller.getEdit );
router.get( '/excluir/:id', controller.getDelete );

router.post( '/save', controller.postNew );
router.post( '/edit', controller.postEdit );


module.exports = router;