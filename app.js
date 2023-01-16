

const wrapper = document.querySelector('.wrapper');
const inputPart = wrapper.querySelector('.input-part');
const infoTxt = inputPart.querySelector('.info-txt');
const inputField = inputPart.querySelector('input');
const wIcon = wrapper.querySelector('.weather-part img')
const arrowBack = wrapper.querySelector('header i');

const locationBtn = inputPart.querySelector('button');
const myAPI = `4fe02e564bc3e200916f437e0b1d9006`;


let api;


inputField.addEventListener('keyup', (e) => {

   if (e.key === 'Enter' && inputField.value) {
      requestApi(inputField.value)
   }
})

locationBtn.addEventListener('click', () => {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError)
   } else {
      alert('Your browser not support geolocation api')
   }
})

function onSuccess(position) {
   const { latitude, longitude } = position.coords;
   api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${myAPI}`;
   fetchData();
}

function onError(error) {
   infoTxt.textContent = error.message;
   infoTxt.classList.add('error')

}

function requestApi(city) {
   api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myAPI}`;
   fetchData();

}

function fetchData() {
   infoTxt.textContent = "Getting weather details...";
   infoTxt.classList.add('pending')
   fetch(api)
      .then((response) => response.json())
      .then((result) => weatherDatails(result))
}


function weatherDatails(info) {
   if (info.cod === '404') {
      infoTxt.textContent = `${inputField.value} isn't valid city name `;
      infoTxt.classList.replace('pending', 'error');
   } else {

      const city = info.name;
      const country = info.sys.country;
      const { description, id } = info.weather[0];
      const { feels_like, humidity, temp } = info.main;

      if (id === 800) {
         wIcon.src = "icons/clear.svg"
      } else if (id >= 200 && id <= 232) {
         wIcon.src = "icons/storm.svg"
      } else if (id >= 600 && id <= 622) {
         wIcon.src = "icons/snow.svg"
      } else if (id >= 701 && id <= 781) {
         wIcon.src = "icons/haze.svg"
      } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
         wIcon.src = "icons/rain.svg"
      } else if (id > 800 && id <= 804) {
         wIcon.src = "icons/scatClouds.svg"
      }

      wrapper.querySelector('.temp .numb').textContent = Math.floor(temp);
      wrapper.querySelector('.weather').textContent = description;
      wrapper.querySelector('.location span').textContent = `${city}, ${country}`;
      wrapper.querySelector('.temp .numb-2').textContent = Math.floor(feels_like);
      wrapper.querySelector('.humidity span').textContent = `${humidity}%`;

      infoTxt.classList.remove('pending', 'error');
      wrapper.classList.add('active');
   }
   console.log(info);
}

arrowBack.addEventListener('click', () => {
   wrapper.classList.remove('active');
   inputField.value = '';
})