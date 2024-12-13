const greeting = document.querySelector(".greeting-text");
const homeGreeting = document.getElementById("home-greeting");

const date = new Date();
const hour = date.getHours();
const day = date.getDay();
const month = date.getMonth();

const changeGreetingByTime = (hour) => {
  if (hour < 12) {
    greeting.innerHTML = "Good Morning! ☀️";
  } else if (hour < 18) {
    greeting.innerHTML = "Good Afternoon! *";
  } else if (hour > 18) {
    greeting.innerHTML = "Good evening! 🌙";
  } else {
    changeGreetingBySeason();
  }
};

const changeGreetingBySeason = (month, day) => {
  if ((month = 1 && day === 1)) {
    greeting.tinnerHTML = "Happy New Year! 🎉";
  } else if ((month = 3 && day === 21)) {
    greeting.innerHTML = "Happy Spring! 🌷";
  } else if ((month = 6 && day === 19)) {
    greeting.tinnerHTML = "Happy Juneteenth! 👫🏾";
  } else if ((month = 6 && day === 21)) {
    greeting.innerHTML = "Happy Summer! ☀️";
  } else if ((month = 7 && day === 4)) {
    greeting.innerHTML = "Happy 4th of July! 🇺🇸";
  } else if ((month = 9 && day === 21)) {
    greeting.innerHTML = "Happy Autumn! 🍂";
  } else if ((month = 10 && day === 31)) {
    greeting.innerHTML = "Happy Halloween! 🎃";
  } else {
    greeting.innerHTML = "Season's Greetings! 🎄";
  }
};

changeGreetingByTime();
