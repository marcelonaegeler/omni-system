var Parse = ( function () {

	var date = function ( d ) {
		d = d.split( '/' );
		return new Date( d[ 2 ], d[ 1 ], d[ 0 ], 0, 0, 0 );
	};

	var dateToString = function ( d ) {
		return [ padding( d.getDate() ), padding( d.getMonth() + 1 ), d.getFullYear() ].join( '/' );
	};

	var dateTimeToString = function ( d ) {
		return [
			[ padding( d.getDate() ), padding( d.getMonth() + 1 ), d.getFullYear() ].join( '/' )
			, [ padding( d.getHours() ), padding( d.getMinutes() ) ].join( ':' )
		].join( ' - ' );
	};

	var padding = function ( pad ) {
		return ( '00' + pad ).slice( -2 );
	};

	return {
		date: date
		, dateToString: dateToString
		, dateTimeToString: dateTimeToString
	};
})();

module.exports = Parse;