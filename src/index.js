import debounce from "lodash.debounce";
import fetchCountries from "./fetchCountries";
import { alert, info } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const searchInput = document.querySelector(".country-search");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchInput.addEventListener("input", debounce(onSearch, 500));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery === "") {
    clearResults();
    return;
  }

  fetchCountries(searchQuery)
    .then((countries) => handleCountries(countries))
    .catch((error) => alert("Error", "Country not found"));
}

function handleCountries(countries) {
  clearResults();

  if (countries.length > 10) {
    info({
      text: "Please make your search more specific!",
    });
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryInfo(countries[0]);
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map((country) => `<li>${country.name}</li>`)
    .join("");
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = `
    <h2>${country.name}</h2>
    <p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${country.languages
      .map((lang) => lang.name)
      .join(", ")}</p>
    <img src="${country.flag}" alt="Flag of ${country.name}" width="200">
  `;
  countryInfo.innerHTML = markup;
}

function clearResults() {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
}
