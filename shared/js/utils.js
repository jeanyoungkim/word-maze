// JS Date is _insane_. Add 1 to zero-indexed month to get accurate # of days in that month
var getDaysInMonth = function getDaysInMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// startDate format: 'MM/DD/YYY'
var getNthDayOfTest = function getNthDayOfTest(startDate) {
	// Starts at 0
	var startOfTest = new Date(startDate);
	var today = new Date();

	var startDate = startOfTest.getDate();
	var todaysDate = today.getDate();

	var startMonth = startOfTest.getMonth();
	var todaysMonth = today.getMonth();
	var sameMonth = startMonth === todaysMonth;

	var startYear = startOfTest.getFullYear();
	var todaysYear = today.getFullYear();
	var sameYear = todaysYear === startYear;

	if (todaysDate === startDate) {
		return 0;
	} else if (sameYear && sameMonth && todaysDate > startDate) {
		return todaysDate - startDate;
	} else {
		var remainderOfStartMonth = getDaysInMonth(startOfTest) - startDate;
		return remainderOfStartMonth + todaysDate;
	}
};

// Rendering + Animation
var animate = function animate(el, animation) {
	var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;

	el.classList.toggle('' + animation);
	_.delay(function () {
		return el.classList.toggle('' + animation);
	}, duration);
};
