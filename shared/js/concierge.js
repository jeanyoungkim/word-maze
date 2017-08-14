var concierge = document.querySelector('#concierge');

var takeOverScroll = function() {
	if (window.scrollY > 15) {
		animate(concierge, 'swipe');
		_.delay(function () {
			return concierge.style.display = 'none';
		}, 800);
	}
};

var initializeConcierge = function() {
	concierge.addEventListener('touchend', takeOverScroll);
}

initializeConcierge();
