// toggle displays //
// play music, sounds, etc. //
// set reminder notifications, etc. //
// use API for reminders and exercises, if necessary //
// task object(s) with properties (e.g. id, title, dueDate/dueTime, isCompleted) //
// reminder object(s) with properties (e.g. taskId reminderTime) //
// functions to add, edit, delete, and mark tasks as completed //
// system for reminder scheduling (using setTimeout or setInterval) //
// timers for exercise duration, animation, sound effects //
// save tasks and reminders to local storage //
// list major functions //
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
