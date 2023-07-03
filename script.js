import Data from "./config.js";

//Global constants
const searchBar = document.querySelector("#searchBar");
const container = document.querySelector(".container");
const cityNameContainer = document.querySelector(".city-name");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
console.log("hello world");

// Create the elements with Data
const createCard = (data, dayOfTheWeek) => {
    const card = document.createElement("div");
    card.classList.add("card");
    container.appendChild(card);
    const imageBox = document.createElement("div");
    imageBox.classList.add("imgBx");
    card.appendChild(imageBox);
  
    const cardImg = document.createElement("img");
    cardImg.src =
      "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    imageBox.appendChild(cardImg);
  
    const contentBox = document.createElement("div");
    contentBox.classList.add("contentBx");
    card.appendChild(contentBox);
  
    const cardHeader = document.createElement("h2");
    cardHeader.innerHTML = dayOfTheWeek;
    contentBox.appendChild(cardHeader);
  
    const tempDescription = document.createElement("h4");
    tempDescription.innerHTML = data.weather[0].description;
    contentBox.appendChild(tempDescription);
  
    const currentTempBox = document.createElement("div");
    currentTempBox.classList.add("color");
    contentBox.appendChild(currentTempBox);
  
    const currentTempHeader = document.createElement("h3");
    currentTempHeader.innerHTML = "Temp:";
    currentTempBox.appendChild(currentTempHeader);
  
    const currentTemp = document.createElement("span");
    currentTemp.classList.add("current-temp");
    currentTemp.innerHTML = data.main.temp + "°C";
    currentTempBox.appendChild(currentTemp);
  
    const minMaxTemperatures = document.createElement("div");
    minMaxTemperatures.classList.add("details");
    contentBox.appendChild(minMaxTemperatures);
  
    const minMaxTempHeader = document.createElement("h3");
    minMaxTempHeader.innerHTML = "More:";
    minMaxTemperatures.appendChild(minMaxTempHeader);
  
    const minTemp = document.createElement("span");
    minTemp.classList.add("min-temp");
    minTemp.innerHTML = data.main.temp_min + "°C";
    minMaxTemperatures.appendChild(minTemp);
  
    const maxTemp = document.createElement("span");
    maxTemp.classList.add("max-temp");
    maxTemp.innerHTML = data.main.temp_max + "°C";
    minMaxTemperatures.appendChild(maxTemp);
  };

//Gets the weather forecast based on the coordinates and creates cards
const getWeather = (lat, lon) => {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&exclude=minutely,hourly,alerts&appid=" +
      Data.key
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      console.log(
        "Welcome to this basic weather app. this is not a product but the product of an academic exercise."
      );

      // Removing all child elements from Container before creating new set of elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Looping through 5 days of weather data
      for (let i = 0; i < result.list.length; i = i + 8) {
        console.log(result.length);

        // Use the remainder operator (%) to switch from saturday (last in array) back to sunday (first in array)
        const date = new Date();
        let dayOfTheWeek = weekdays[(date.getDay() + i / 8) % 7];
        const data = result.list[i];

        // Create the elements with Data
        createCard(data, dayOfTheWeek);
      }
    });
};


//Gets the coordinates for the city and triggers the create card function
const getCoordinates = (apiUrl) => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const lon = data.city.coord.lon;
      const lat = data.city.coord.lat;

      cityNameContainer.innerHTML = data.city.name;

      // Fetching final data according to the coordinates
      getWeather(lat, lon);
    })
    .catch((error) => {
      // If there are errors, send out an error message
      console.error("Error:", "not a place!");
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      return alert("Are you sure you aren't holding your map upside down?");
    });
};

// Event will start on a keyup action
searchBar.addEventListener("keyup", (event) => {
  // checking the action for specific key (Enter)
  if (event.key === "Enter") {
    // Store target in variable
    const thisCity = event.target.value.toLowerCase();
    const apiUrl =
      "https://api.openweathermap.org/data/2.5/forecast/?q=" +
      thisCity +
      "&appid=" +
      Data.key;
    event.currentTarget.value = "";
    // Fetching first api to get the City coordinates
    getCoordinates(apiUrl);
  }
});
