class Time {
  getCurrentTime() {
    let today = new Date();
    let hour = today.getHours();
    let min = this.addZero(today.getMinutes());
    let sec = this.addZero(today.getSeconds());

    // Set AM or PM
    const amPm = hour >= 12 ? "PM" : "AM";

    // 12hr Format
    hour = hour % 12 || 12;

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
}

class View {
  constructor(timeObject, timeElement) {
    this.timeObject = timeObject;
    this.timeElement = timeElement;
  }

  showTime(showAmPm) {
    const {hour, min, sec, amPm} = this.timeObject.getCurrentTime();
    this.timeElement.innerHTML = `${hour}<span>:</span>${min}<span>:</span>${sec} ${
      showAmPm ? amPm : ""
    }`;
    setTimeout(this.showTime.bind(this), 1000, showAmPm);
  }
}

class Momentum {
  constructor(view) {
    this.view = view;
  }

  run(showAmPm = true) {
    this.view.showTime(showAmPm);
  }
}

// DOM Elements
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
const focus = document.getElementById('focus');

const timeObject = new Time();
const view = new View(timeObject, time);
const momentum = new Momentum(view);
momentum.run();

