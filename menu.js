const restaurantsElem = document.querySelector('.restaurants');
const inputBox = document.getElementById('search');
const errorMessage = document.querySelector('.errorNotify');

let hotelLists = [];

let getData = () => fetch("menu.json").then(data => data.json());

const getHotelCard = hotel => {
    let a = JSON.parse(localStorage.getItem('favourites'));
    let favIconClass;
    if (a !== null) {
        favIconClass = (a.find(fav => fav.id == hotel.id)) ? "fav-id-red" : "fav-id";
    } else {
        favIconClass = "fav-id";
    }

    return `
    <div class='hotel-card shadow d-flex flex-column'>
        <img class='hotel-image' src="${hotel.img}" />
        <div class="hotel-description">
            <p class="hotel-name">${hotel.name}</p>
            <p class="hotel-cost">${hotel.cost} RS</p>
            <div style="padding: 0 10px;">
                <span class="hotel-location fa fa-star checked">${hotel.rating}</span>
            </div>
            <div class="number-picker">
                <button id="decrease">-</button>
                <span class="number">${hotel.order}</span>
                <button id="increase">+</button>
            </div>
        </div>
    </div>
    `;
};

const generateRestaurantList = data => data.map(hotel => getHotelCard(hotel));

const displayAllHotels = () => {
    getData()
        .then(resp => {
            hotelLists = resp;
            restaurantsElem.innerHTML = generateRestaurantList(resp).join('');
        })
        .catch(error => errorMessage.innerHTML = 'Something bad happened!! We are working on it');
};

displayAllHotels();

const searchResult = () => {
    let filteredList = hotelLists.filter(hotel => {
        return hotel.name.toLowerCase().includes(inputBox.value.toLowerCase()) || String(hotel.cost).includes(inputBox.value);
    });
    restaurantsElem.innerHTML = (filteredList.length == 0) ? "No Results Found!!" : generateRestaurantList(filteredList).join('');
};

let debounce = (fn, delay) => {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(), delay);
    };
};

let search = debounce(searchResult, 400);

document.addEventListener('input', search);

const sortby = e => {
    if (e.target.value == 'rating') {
        let sortByRatingList = hotelLists.sort((a, b) => b.rating - a.rating);
        restaurantsElem.innerHTML = generateRestaurantList(sortByRatingList).join('');
    } else if (e.target.value == "cost") {
        let sortByCostList = hotelLists.sort((a, b) => a.cost - b.cost);
        restaurantsElem.innerHTML = generateRestaurantList(sortByCostList).join('');
    }
};

document.getElementById('sort').addEventListener('change', sortby);

// Get the necessary elements
const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');
const numberInput = document.getElementById('number');

// Decrement the value when the decrease button is clicked
decreaseButton.addEventListener('click', () => {
    let currentValue = parseInt(numberInput.textContent);
    if (currentValue > 0) {
        numberInput.textContent = currentValue - 1;
    }
});

// Increment the value when the increase button is clicked
increaseButton.addEventListener('click', () => {
    let currentValue = parseInt(numberInput.textContent);
    numberInput.textContent = currentValue + 1;
});
