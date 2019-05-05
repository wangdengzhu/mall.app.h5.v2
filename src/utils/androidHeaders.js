(function() {
	let isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1;
	let androidHeaders = null;

	if (!isAndroid) {
		return;
	}

	try {
		androidHeaders = JSON.parse(window.manjdSales.getHeaderInfo());
	} catch (e) {
		androidHeaders = null;
	}

	window.androidHeaders = androidHeaders;
}());