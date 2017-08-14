// Modals
function setUpEvents() {
	var closeButtons = document.querySelectorAll('.close-x');
	closeButtons.forEach(function(button) {
		button.addEventListener('click', function(e) {
			var modalContent = button.parentElement;
			var modalId = modalContent.parentElement.id;
			var modalName = modalId.split('-')[0]
			closeModal(modalName);
		});
	});
}

function openModal(modalName) {
	var modal = document.querySelector(`#${modalName}-modal`);
	modal.style.display = 'flex';
	document.querySelector('main').classList.toggle('obscured');
};

function closeModal(modalName) {
	var modal = document.querySelector(`#${modalName}-modal`);
	modal.style.display = 'none';
	document.querySelector('main').classList.toggle('obscured');
};

setUpEvents();
