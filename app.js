const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}) );
app.use(express.static("public"));


app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
  const firstName = req.body.fn;
  const lastName = req.body.ln;
  const email = req.body.email;

  const data = {
    members:[{
      email_address: email,
      status:"subscribed",
      merge_fields:{
        FNAME:firstName,
        LNAME:lastName
      }
    }]
  };
  //fetch data from user input to string
  const jsonData = JSON.stringify(data);//turn a data into string
  const url = "https://us11.api.mailchimp.com/3.0/lists/xxxxxxxxx";
  const options = {
    method:"POST",
    auth:"katie:xxxxxxxxxxxxxxxxxxxx"
  }
  //make requests:connect to mailchimp api and post data (save data to other's server: https.request)
  const request = https.request(url, options, function(response){
    //check if the sign up is successful or not:
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    //check what data mailchip send to us
      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
  })
  //write data to mailchimp audience list
  request.write(jsonData);
  request.end();

});

// api key: xxxxxxx
//audience id: xxxxxxxxx

//faulure page redirect to home page
app.post("/failure", function(req, res){
  res.redirect("/");
})



app.listen(process.env.PORT||3000, function(){
  console.log("server is running on port 3000");
})
