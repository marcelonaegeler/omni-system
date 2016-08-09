var express = require( 'express' )
	, router = express.Router()
	, controller = require( '../controllers/StockController' )
	;

router.get( '/', controller.getIndex );
router.get( '/adicionar', controller.getAdd );
/*
router.get( '/novo', controller.getNew );

router.get( '/editar/:id', controller.getEdit );

router.post( '/save',  controller.postSaveNew );

router.post( '/edit',  controller.postSaveEdit );
*/

module.exports = router;