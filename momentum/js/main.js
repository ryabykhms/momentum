class Time {
  constructor(is24h = false, locale = 'en-Us') {
    this.is24h = is24h;
    this.locale = locale;
  }

  getCurrentTime(is24h = false) {
    let today = new Date();
    let hour = today.getHours();
    let min = this.addZero(today.getMinutes());
    let sec = this.addZero(today.getSeconds());
    let dayOfWeek = today.toLocaleDateString(this.locale, { weekday: 'long' });
    let dayOfMonth = today.getDate();
    let month = today.toLocaleDateString(this.locale, { month: 'long' });

    // Set AM or PM
    const amPm = hour >= 12 ? 'PM' : 'AM';

    // 12hr Format
    hour = this.is24h || is24h ? hour : hour % 12 || 12;

    return {
      hour,
      min,
      sec,
      dayOfWeek,
      dayOfMonth,
      month,
      amPm,
    };
  }

  addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }

  getTimeOfDay() {
    const { hour } = this.getCurrentTime(true);
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
  constructor(
    timeObject,
    timeElement,
    greetingElement,
    nameElement,
    focusElement,
    nextElement,
    container = document.body
  ) {
    this.timeObject = timeObject;
    this.timeElement = timeElement;
    this.greetingElement = greetingElement;
    this.nameElement = nameElement;
    this.focusElement = focusElement;
    this.nextElement = nextElement;
    this.container = container;

    this.maxLength = {
      name: 50,
      focus: 100,
    };

    this.currentBackground = {};
    this.setEventListeners();
  }

  addBackgrounds(backgrounds) {
    this.backgrounds = backgrounds;
  }

  showTime(showAmPm) {
    const {
      hour,
      min,
      sec,
      dayOfWeek,
      dayOfMonth,
      month,
      amPm,
    } = this.timeObject.getCurrentTime();
    this.timeElement.innerHTML = `<div class="day">${dayOfWeek}, ${dayOfMonth} ${month}</div>${hour}<span>:</span>${min}<span>:</span>${sec} ${
      showAmPm && !this.timeObject.is24h ? amPm : ''
    }`;
    if (min === '00' && sec === '00') {
      this.setBackground(hour);
    }
    setTimeout(this.showTime.bind(this), 1000, showAmPm);
  }

  setBackground(hour) {
    if (this.backgrounds !== undefined) {
      if (hour === undefined) {
        hour = this.timeObject.getCurrentTime().hour;
      }
      const timeOfDay = this.timeObject.getTimeOfDay().toLowerCase();
      let imgNumber = this.backgrounds[timeOfDay][hour % 6];
      imgNumber = imgNumber < 10 ? `0${imgNumber}` : imgNumber;
      const url = `assets/img/${timeOfDay}/${imgNumber}.jpg`;
      this.vieBgImage(url);
    }
  }

  setGreeting() {
    const timeOfDay = this.timeObject.getTimeOfDay();
    this.greetingElement.textContent = 'Good ' + timeOfDay;
  }

  getName() {
    if (localStorage.getItem('name') === null) {
      this.nameElement.textContent = '[Enter Name]';
    } else {
      this.nameElement.textContent = localStorage.getItem('name');
    }
  }

  getFocus() {
    if (localStorage.getItem('focus') === null) {
      this.focusElement.textContent = '[Enter Focus]';
    } else {
      this.focusElement.textContent = localStorage.getItem('focus');
    }
  }

  setText(e, itemName) {
    if (e.target.textContent.trim() === '') {
      const item = localStorage.getItem(itemName);
      if (item === null || item.trim() === '') {
        e.target.textContent = `[Enter ${itemName}]`;
      } else {
        e.target.textContent = item;
      }
    } else {
      localStorage.setItem(itemName, e.target.textContent);
    }
  }

  setName(e) {
    this.setStorageAfterEvent(e, 'name');
  }

  setFocus(e) {
    this.setStorageAfterEvent(e, 'focus');
  }

  setStorageAfterEvent(e, item) {
    if (e.target.textContent.length > this.maxLength[item]) {
      e.preventDefault();
    }
    if (e.type === 'keypress') {
      // Make sure enter is pressed
      if (e.which == 13 || e.keyCode == 13) {
        this.setText(e, item);
        e.target.blur();
      }
    } else {
      this.setText(e, item);
    }
  }

  clearField(e) {
    e.target.textContent = '';
  }

  vieBgImage(data) {
    const body = document.querySelector('body');
    const src = data;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      body.style.backgroundImage = `url(${src})`;
    };
  }

  changeBackground(e) {
    if (this.backgrounds !== undefined) {
      if (Object.keys(this.currentBackground).length === 0) {
        this.currentBackground = {
          timeOfDay: this.timeObject.getTimeOfDay().toLowerCase(),
          number: (this.timeObject.getCurrentTime(true).hour % 6) + 1,
        };
      } else {
        let timeOfDay = this.currentBackground.timeOfDay;
        const number = +this.currentBackground.number + 1;
        if (this.backgrounds[timeOfDay][number] === undefined) {
          switch (timeOfDay) {
            case 'morning':
              timeOfDay = 'afternoon';
              break;
            case 'afternoon':
              timeOfDay = 'evening';
              break;
            case 'evening':
              timeOfDay = 'night';
              break;
            default:
              timeOfDay = 'morning';
              break;
          }
          this.currentBackground = {
            timeOfDay,
            number: 1,
          };
        } else {
          this.currentBackground = {
            timeOfDay,
            number,
          };
        }
      }
      const imgNumber =
        this.currentBackground.number < 10
          ? `0${this.currentBackground.number}`
          : this.currentBackground.number;
      const imageSrc = `assets/img/${this.currentBackground.timeOfDay}/${imgNumber}.jpg`;
      this.vieBgImage(imageSrc);
    }
    e.target.disabled = true;
    setTimeout(function () {
      e.target.disabled = false;
    }, 1000);
  }

  setEventListeners() {
    this.nameElement.addEventListener('keypress', this.setName.bind(this));
    this.nameElement.addEventListener('blur', this.setName.bind(this));
    this.nameElement.addEventListener('click', this.clearField.bind(this));
    this.focusElement.addEventListener('keypress', this.setFocus.bind(this));
    this.focusElement.addEventListener('blur', this.setFocus.bind(this));
    this.focusElement.addEventListener('click', this.clearField.bind(this));
    this.nextElement.addEventListener(
      'click',
      this.changeBackground.bind(this)
    );
  }
}

class Momentum {
  constructor(view) {
    this.view = view;
    this.backgrounds = {};
  }

  generateArrayRandomNumber(min, max) {
    var totalNumbers = max - min + 1,
      arrayTotalNumbers = [],
      arrayRandomNumbers = [],
      tempRandomNumber;

    while (totalNumbers--) {
      arrayTotalNumbers.push(totalNumbers + min);
    }

    while (arrayTotalNumbers.length) {
      tempRandomNumber = Math.round(
        Math.random() * (arrayTotalNumbers.length - 1)
      );
      arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
      arrayTotalNumbers.splice(tempRandomNumber, 1);
    }

    return arrayRandomNumbers;
  }

  generateBackgrounds() {
    const random = this.generateArrayRandomNumber(1, 20);
    this.backgrounds = {
      morning: random.slice(0, 6),
      afternoon: random.slice(0, 6),
      evening: random.slice(0, 6),
      night: random.slice(0, 6),
    };
  }

  run(showAmPm = true) {
    this.generateBackgrounds();
    this.view.addBackgrounds(this.backgrounds);
    this.view.setBackground();
    this.view.showTime(showAmPm);
    this.view.setGreeting();
    this.view.getName();
    this.view.getFocus();
  }
}

class Quote {
  constructor(qouteElement, authorElement, nextQuoteButton, lang = 'en') {
    this.qouteElement = qouteElement;
    this.authorElement = authorElement;
    this.nextQuoteButton = nextQuoteButton;
    this.lang = lang;

    document.addEventListener('DOMContentLoaded', this.getQuote.bind(this));
    nextQuoteButton.addEventListener('click', this.getQuote.bind(this));
  }

  async getQuote() {
    const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=${this.lang}`;
    const res = await fetch(url);
    const data = await res.json();
    this.qouteElement.textContent = data.quoteText;
    this.authorElement.textContent = data.quoteAuthor;
  }
}

class Weather {
  constructor(city, lang = 'en', units = 'metric') {
    this.city = city;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    this.apiKey = '08f2a575dda978b9c539199e54df03b0';
    this.lang = lang;
    this.units = units;

    this.city.textContent = this.city.textContent || 'Minsk';

    document.addEventListener('DOMContentLoaded', this.getWeather.bind(this));
    this.city.addEventListener('keypress', this.setCity.bind(this));
    this.city.addEventListener('keypress', this.setCity.bind(this));
    this.city.addEventListener('blur', this.setCity.bind(this));

    this.weatherIcon = document.querySelector('.weather-icon');
    this.temperature = document.querySelector('.temperature');
    this.weatherDescription = document.querySelector('.weather-description');
  }

  buildApiLink() {
    const city = this.city.textContent;
    const apiUrl = this.apiUrl;
    const apiKey = this.apiKey;
    const lang = this.lang;
    const units = this.units;

    return `${apiUrl}q=${city}&lang=${lang}&appid=${apiKey}&units=${units}`;
  }

  async getWeather() {
    const url = this.buildApiLink();
    const res = await fetch(url);
    const data = await res.json();

    const idWeatherIcon = data.weather[0].id;
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;

    this.weatherIcon.className = 'weather-icon owf';
    this.weatherIcon.classList.add(`owf-${idWeatherIcon}`);
    this.temperature.textContent = `${temperature}°C`;
    this.weatherDescription.textContent = weatherDescription;

    // console.log(idWeatherIcon, weatherDescription, temperature);
  }

  // setCity(event) {
  //   if (event.code === 'Enter') {
  // this.getWeather();
  // this.city.blur();
  //   }
  // }

  getCity() {
    if (localStorage.getItem('name') === null) {
      this.nameElement.textContent = '[Enter Name]';
    } else {
      this.nameElement.textContent = localStorage.getItem('name');
    }
  }

  setText(e, itemName) {
    if (e.target.textContent.trim() === '') {
      const item = localStorage.getItem(itemName);
      if (item === null || item.trim() === '') {
        e.target.textContent = `Minsk`;
      } else {
        e.target.textContent = item;
      }
    } else {
      localStorage.setItem(itemName, e.target.textContent);
    }
  }

  setCity(e) {
    this.setStorageAfterEvent(e, 'city');
  }

  setStorageAfterEvent(e, item) {
    if (e.type === 'keypress') {
      // Make sure enter is pressed
      if (e.which == 13 || e.keyCode == 13) {
        this.setText(e, item);
        e.target.blur();
        this.getWeather().catch((err) => {
          e.target.textContent = 'Minsk';
        });
      }
    } else {
      this.setText(e, item);
      this.getWeather().catch((err) => {
        e.target.textContent = 'Minsk';
      });
    }
  }

  clearField(e) {
    e.target.textContent = '';
  }
}

// DOM Elements
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
const focus = document.getElementById('focus');
const next = document.getElementById('next-image');
const nextQuote = document.getElementById('next-quote');
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

const city = document.querySelector('.city');
const weather = new Weather(city);

const is24h = true;
const timeObject = new Time(is24h);
const quoteObject = new Quote(blockquote, figcaption, nextQuote);
const view = new View(timeObject, time, greeting, name, focus, next);
const momentum = new Momentum(view);
momentum.run();
