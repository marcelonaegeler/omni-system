Number.prototype.formatMoney = function () {
	return this.toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } );
};

var Orders = ( function () {
	"use strict";

	var orderProducts = {};
	var products = document.querySelectorAll( '.add_products' );
	var displayOrder = document.getElementById( 'display-order' );
	var displayTotal = document.getElementById( 'display-total' );
	var inputTotal = document.getElementById( 'input-total' );


	if ( typeof Data !== 'undefined' ) {
		for ( var i = 0, l = Data.length; i < l; i++ ) {
			orderProducts[ Data[ i ]._id ] = {
				name: Data[ i ].name
				, price: +Data[ i ].price
				, quantity: +Data[ i ].quantity
			};
		}
	}


	for ( var i = 0, l = products.length; i < l; i++ ) {
		products[ i ].onchange = function () {
			if ( this.checked ) {
				var el = this;
				orderProducts[ el.value ] = {
					name: el.dataset.name
					, price: +el.dataset.price
					, quantity: 1
				};
			} else {
				if ( orderProducts[ this.value ] ) {
					delete orderProducts[ this.value ];
				}
			}


			changedList();
		};
	}


	var parseData = function () {
		var layout = '';
		for ( var product in orderProducts ) {
			layout += '<tr><td>';
				layout += orderProducts[ product ].name;
			layout += '</td><td>';
				layout += '<input type="number" name="quantity[]" class="mdl-textfield__input input_quantity" value="'+ orderProducts[ product ].quantity +'" data-id="' + product + '" />'
				layout += '<input type="hidden" name="product_id[]" value="'+ product +'" />'
			layout += '</td><td>';
				layout += ( orderProducts[ product ].price ).formatMoney();
			layout += '</td></tr>';
		}

		if ( !Object.keys( orderProducts ).length ) {
			layout += '<tr><td colspan="3" class="text-center">Selecione produtos ao lado para o pedido.</td></tr>';
		}

		return layout;
	};

	var setTriggers = function () {
		var triggers = document.querySelectorAll( '.input_quantity' );
		for ( var i = 0, l = triggers.length; i < l; i++ ) {
			triggers[ i ].onchange = function () {
				orderProducts[ this.dataset.id ].quantity = +this.value;

				changedList();
			};
		}
	};

	var setTotal = function () {
		var total = 0;
		for ( var product in orderProducts ) {
			if ( orderProducts[ product].quantity > 0 ) {
				total += ( orderProducts[ product].quantity * orderProducts[ product].price );
			}
		}

		displayTotal.innerHTML = total.formatMoney();
		inputTotal.value = total;
	};

	var changedList = function () {
		displayOrder.innerHTML = parseData();
		setTriggers();
		setTotal();
	};

	setTriggers();
	setTotal();

})();