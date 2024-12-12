const greeting = document.querySelector(".greeting");

const date = newDate();
const hour = date.getHours();
const day = date.getDays();
const month = date.getMonths();

const changeGreetingByTime = () => {
  if (hour < 12) {
    greeting.textContent = "Good Morning! ☀️";
  } else if (hour < 18) {
    greeting.textContent = "Good Afternoon! *";
  } else {
    greeting.textContent = "Good evening! 🌙";
  }

  if ((month = 1 && day === 1)) {
    greeting.textContent = "Happy New Year! 🎉";
  }

  if ((month = 3 && day === 21)) {
    greeting.textContent = "Happy Spring! 🌷";
  }

  if ((month = 6 && day === 19)) {
    greeting.textContent = "Happy Juneteenth! 👫🏾";
  }

  if ((month = 6 && day === 21)) {
    greeting.textContent = "Happy Summer! ☀️";
  }

  if ((month = 7 && day === 4)) {
    greeting.textContent = "Happy 4th of July! 🇺🇸";
  }

  if ((month = 9 && day === 21)) {
    greeting.textContent = "Happy Autumn! 🍂";
  }

  if (month > 10) {
    greeting.textContent = "Season's Greetings! 🎄";
  }
};
