var express = require( 'express' )
	, router = express.Router()
	, controller = require( '../controllers/ProductsController' )
	;

router.get( '/', controller.getIndex );

router.get( '/novo', controller.getNew );

router.get( '/editar/:id', controller.getEdit );

router.post( '/save',  controller.postSaveNew );

router.post( '/edit',  controller.postSaveEdit );


module.exports = router;