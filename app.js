async function app() {
	// get the data from the api request
	const list = await getData();
	const input = document.querySelector('input[name="search-products"]');

	// if list doesn't have any values, disable the input so the user can't type anything
	if (list.length == 0) {
		input.disabled = true;
	} else {
		// otherwise, when the user types into the input and show a filtered list of items that contain text that the user has typed in
		input.addEventListener('keyup', () => filterList(list, input));
	}

	// when the user has clicked, they must be done typing, so hide the dropdown menu
	document.addEventListener('click', clearDropdown);
}

/**
 *
 * @param {*} [list string[];
 * @param {*} [input html input] html input element. This is needed in another function, so instead of declaring it more than once, it is assigned once (in app, like 4), and reused in this function
 */
function filterList(list, input) {
	// on every keyup event, a div, and a ui is added and removed from the dom
	// this would likely impact performance
	// alternatively, those could be added into the dom once with display set to none,
	// then modified to become visible in this event handler
	const oldDropdown = document.querySelector('.platt__dropdown');
	const searchSection = document.querySelector('.platt__search');
	
	// since this function runs every time the user has typed a key, we have to clean up the dom so that we don't stack multiple dropdown menus on top of eachother
	if (oldDropdown) {
		searchSection.removeChild(oldDropdown);
	}

	// create a new instance of our dropdown, position it below the input and aligned left, additionally add a class that we've defined some styles
	const dropdownMenu = document.createElement('div');
	dropdownMenu.setAttribute('style', `top: 45px; left: ${input.offsetLeft}px`);
	dropdownMenu.setAttribute('class', 'platt__dropdown');
	
	// create an unordered list element and append it to the dropdown div
	const ul = document.createElement('ul');
	dropdownMenu.appendChild(ul);
	
	// given the list of strings, remove all elements from that list if they don't contain text that exists in the element
	const filteredList = list.filter(val => val.toUpperCase().includes(input.value.toUpperCase()));

	// add each element from the filtered list to the dom
	for (let item of filteredList) {
		const li = document.createElement('li');
		const text = document.createTextNode(item);
		li.appendChild(text);
		ul.appendChild(li);

		// if the user clicks on an element, reset the input text to that element
		li.addEventListener('click', () => setInput(item, input));
	}

	// render the dropdown menu that we created above into the search section so the user can see possible values
	searchSection.appendChild(dropdownMenu);

	// if the user has a match, hide the dropdown, example if the user has typed 'abc' and the list argument is ['abc', 'def'], then the filtered list would be ['abc']
	if (filteredList.length == 1 && filteredList[0].toUpperCase() == input.value.toUpperCase()) {
		searchSection.removeChild(dropdownMenu);
	}
}


function clearDropdown() {
	const dropdownMenu = document.querySelector('.platt__dropdown');
	const searchSection = document.querySelector('.platt__search');
	if (dropdownMenu) {
		searchSection.removeChild(dropdownMenu);
	}
}

function setInput(text, input) {
	input.value = text;
}

async function getData() {
	return await fetch('https://swapi.co/api/planets')
		.then((response) => response.json())
		.then((data) => data.results.map((row) => row.name));
}

app();