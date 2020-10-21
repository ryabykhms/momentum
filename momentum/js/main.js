class Time {
  getCurrentTime(is24h = false) {
    let today = new Date();
    let hour = today.getHours();
    let min = this.addZero(today.getMinutes());
    let sec = this.addZero(today.getSeconds());

    // Set AM or PM
    const amPm = hour >= 12 ? "PM" : "AM";

    // 12hr Format
    hour = is24h ? hour : hour % 12 || 12;

    return {
      hour,
      min,
      sec,
      amPm,
    };
  }

  addZero(n) {
    return (parseInt(n, 10) < 10 ? "0" : "") + n;
  }

  getTimeOfDay() {
    const {hour} = this.getCurrentTime(true);
    if (hour < 6) {
      return 'Night';
    } else if (hour < 12) {
      return 'Morning';
    } else if (hour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }
}

class View {
  constructor(timeObject, timeElement, greetingElement, focusElement, container = document.body) {
    this.timeObject = timeObject;
    this.timeElement = timeElement;
    this.greetingElement = greetingElement;
    this.focusElement = focusElement;
    this.container = container;
  }

  showTime(showAmPm) {
    const {hour, min, sec, amPm} = this.timeObject.getCurrentTime();
    this.timeElement.innerHTML = `${hour}<span>:</span>${min}<span>:</span>${sec} ${
      showAmPm ? amPm : ""
    }`;
    setTimeout(this.showTime.bind(this), 1000, showAmPm);
  }

  setBackground() {
    const timeOfDay = this.timeObject.getTimeOfDay();
    if (timeOfDay === 'Evening' || timeOfDay === 'Night') {
      this.container.style.color = '#fff';
    }
    this.container.style.backgroundImage = `url('assets/img/${timeOfDay.toLowerCase()}/01.jpg')`;
  }

  setGreeting() {
    const timeOfDay = this.timeObject.getTimeOfDay();
    this.greetingElement.textContent = 'Good ' + timeOfDay;
  }

}

class Momentum {
  constructor(view) {
    this.view = view;
  }

  run(showAmPm = true) {
    this.view.showTime(showAmPm);
    this.view.setGreeting();
    this.view.setBackground();
  }
}

// DOM Elements
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
const focus = document.getElementById('focus');

const timeObject = new Time();
const view = new View(timeObject, time, greeting, focus);
const momentum = new Momentum(view);
momentum.run();

