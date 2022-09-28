const express = require("express")
const https = require("https")
const app = express()
const bodyparser = require("body-parser")
const path = require("path")
app.use(bodyparser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "weather.html"));
});
app.post("/", (req, res) => {
    var location = req.body.Location;
    var url = `https://api.openweathermap.org/data/2.5/weather?appid=45c65d1dcd93c827a04e471c42e67e1b&q=${location}`;
    
    if (req.body.celsius=='on')
        url=url+`&units=metric`;
    https.get(url, (response) => {
        response.on("data", (data) => {
            weatherData = JSON.parse(data);
            // console.log(weatherData);
            if(weatherData.cod==200)
            {
                icon = weatherData.weather[0].icon;
                main = weatherData.weather[0].main;
                temp= weatherData.main.temp;
                iconSrc=`http://openweathermap.org/img/wn/${icon}@2x.png`;
                res.write(`<h1 style="color:red;">${location.toUpperCase()}</h1>`);
                res.write("<h1>Temperate: "+temp+((req.body.celsius=='on')?"C":"K")+"</h1>");
                res.write(`<h1>Main: ${main}<h1>`);
                res.write("<img src='"+iconSrc+"'></img>");
                res.write(`<form action="/" method="post">
                <input type="text" name="Location" id="location" placeholder="Enter the Location">
                <label for="celsius">Celsius</label>
                <input type="checkbox" name="celsius" id="">
                <button type="submit">Submit</button>
            </form>`);
                res.send();
            }
            else
                res.sendFile(path.join(__dirname,"response.html"));
            
        });
    }).on("error", (e) => console.log("error!"));

})
app.listen(process.env.PORT || 3001, () => console.log("App running on port 80"))