var Helpers = ( function () {

	var hasInArrayObject = function ( arr, prop, value ) {
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			if ( arr[ i ][ prop ] == value ) {
				return true;
			}
		}

		return false;
	};

	var mergeById = function ( arr1, arr2 ) {
		var merged = [];

		for ( var i = 0, l = arr1.length; i < l; i++ ) {
			for ( var j = 0, l2 = arr2.length; j < l2; j++ ) {
				if ( arr1[ i ]._id != arr2[ j ]._id ) { continue; }

				var tmp = arr1[ i ];
				tmp.name = arr2[ j ].name;
				tmp.price = arr2[ j ].price_final;

				merged.push( tmp );
			}
		}

		return merged;

	};

	return {
		hasInArrayObject: hasInArrayObject
		, mergeById: mergeById
	};
})();

module.exports = Helpers;