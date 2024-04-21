const apiKey1 = "379964147f378ad9171bc8df803fe45e";
const apiUrl1 = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const apiKey2 = "14f7f4430d1048bd97c60427241604";
const apiUrl2 = "http://api.weatherapi.com/v1/current.json?key=";

const search = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");
let arr = [];

async function getWeatherData(city) {
  let response, data2;
  try {
    // Try fetching data from the second API
    response = await fetch(`${apiUrl2}${apiKey2}&q=${city}&aqi=yes`);
    data2 = await response.json();
    console.log(data2.current.is_day);

    document.querySelector(".city").innerHTML = data2.location.name;
    document.querySelector(".temp").innerHTML = data2.current.temp_c + "°c";
    document.querySelector(".humidity").innerHTML = data2.current.humidity + "%";
    document.querySelector(".wind").innerHTML = data2.current.wind_kph + "km/h";

    weatherIcon.src = data2.current.condition.icon;
    

    const datetimeString = data2.location.localtime;
    const [datePart, timePart] = datetimeString.split(' ');

    
    let dayFrom2ndAPI;
    if(data2.current.is_day=='1'){
      dayFrom2ndAPI = 'Sunday'
    }else if(data2.current.is_day=='2'){
      dayFrom2ndAPI = 'Monday'
    }else if(data2.current.is_day=='3'){
      dayFrom2ndAPI = 'Tuesday'
    }else if(data2.current.is_day=='4'){
      dayFrom2ndAPI = 'Wednesday'
    }else if(data2.current.is_day=='5'){
      dayFrom2ndAPI = 'Thursday'
    }else if(data2.current.is_day=='6'){
      dayFrom2ndAPI = 'Friday'
    }else if(data2.current.is_day=='7'){
      dayFrom2ndAPI = 'Saturday'
    }
let timeIn12Format = convertTo12HoursFormat(timePart);
    document.querySelector(".time").innerHTML = `${dayFrom2ndAPI},${timeIn12Format}`;

    document.querySelector(".date").innerHTML = `${datePart}`;
    document.querySelector(".weatherType").innerHTML = data2.current.condition.text;
    document.querySelector(".weatherText").style.display = "block";
    document.querySelector(".city").style.display = "block";
    document.querySelector(".details").style.display = "flex";
  } catch (error) {
    // If city is not found in the second API, fetch data from the first API
    let data1;
    response = await fetch(`${apiUrl1}${city}&appid=${apiKey1}`);
    data1 = await response.json();

    document.querySelector(".city").innerHTML = data1.name;
    document.querySelector(".temp").innerHTML = Math.round(data1.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data1.main.humidity + "%";
    document.querySelector(".wind").innerHTML = Math.round(data1.wind.speed) + "km/h";

    if (data1.weather[0].main == "Clouds") {
      weatherIcon.src = "./images/clouds.png";
    } else if (data1.weather[0].main == "Clear") {
      weatherIcon.src = "./images/clear.png";
    } else if (data1.weather[0].main == "Rain") {
      weatherIcon.src = "./images/rain.png";
    } else if (data1.weather[0].main == "Drizzle") {
      weatherIcon.src = "./images/drizzle.png";
    } else if (data1.weather[0].main == "Mist") {
      weatherIcon.src = "./images/mist.png";
    } else if (data1.weather[0].main == "Haze") {
      weatherIcon.src = "./images/haze.png";
    }

    const timeStamp = parseInt(data1.dt) * 1000;
    const date = new Date(timeStamp);

    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    document.querySelector(".time").innerHTML = `${day},${formattedTime}`;
    document.querySelector(".date").innerHTML = `${formattedDate}`;
    document.querySelector(".weatherType").innerHTML = data1.weather[0].description;
    document.querySelector(".weatherText").style.display = "block";
    document.querySelector(".city").style.display = "block";
    document.querySelector(".details").style.display = "flex";
  }
}

searchBtn.addEventListener("click", async (ev) => {
  ev.preventDefault();
  try {
    let data = await getWeatherData(search.value);
    arr.push(data);

    console.log("Data to store:", arr); // Add this line

    // Send an AJAX request to the server to store the arr array
    const response = await fetch('/storeData', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ arr })
    });
    const result = await response.text();
    console.log(result);
  } catch (err) {
    console.log(err);
  }

  console.log(arr);
});


function convertTo12HoursFormat(time) {
  [hours, minutes] = time.split(':');
  let period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}
