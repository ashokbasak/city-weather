const express = require("express");
const app = express();
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
// app.use("/js", express.static(__dirname + "public/js"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=0461f4c8e9c5d7b53756a8c926794493&units=metric`;

  https.get(url, (response) => {
    console.log(response.statusCode);

    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temp = Math.round(weatherData.main.temp);
      const description = weatherData.weather[0].description;
      const descriptionUpper = description.toUpperCase();
      const feelsLike = Math.round(weatherData.main.feels_like);
      const tempMin = Math.round(weatherData.main.temp_min);
      const tempMax = Math.round(weatherData.main.temp_max);
      const humidity = weatherData.main.humidity;
      const icon = weatherData.weather[0].icon;
      const imgUrl = ` http://openweathermap.org/img/wn/${icon}.png`;
      // background-color:#FE9898;
      res.send(`
    <div style="background-color:#FE9898;color:white;text-align:center;width:50%;margin:auto;border-radius:12%;font-family:cursive;">
    <h2>Current Temperature in ${query}: ${temp}°C</h2>
    <h2>Feels Like: ${feelsLike}°C</h2>
    <img src="${imgUrl}" alt="">
    <h3>${descriptionUpper}</h3>
    <h2>Maximum Temperature: ${tempMax}°C</h2>
    <h2>Minimum Temperature: ${tempMin}°C</h2>
    <h2>Humidity: ${humidity}%</h2>

</div>

    `);
    });
  });
});

app.listen(process.env.PORT || port, function (req, res) {
  console.log(`Server is running on port ${port}`);
});
