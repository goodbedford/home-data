var request = require('request');
var db = require('./app/models/index');

request.post({url:'http://localhost:3000/api/homes', form:{name: "love house"}}, function(err, response, body) {
    if(err) {
      console.error(err);
    }
    let home = JSON.parse(body);
    for(let i = 1; i <= 2; i++) {
      (function(i, home) {
      console.log(home)
      request.post({url:'http://localhost:3000/api/homes/'+ home._id + "/rooms", form:{name:  "" + i + "room"}}, function(err, response,body){
        if(err) {
          console.error(err);
        }
        console.log("body", body)
        let room = JSON.parse(body);
        console.log("room", room);
        });
      })(i, home);
    }
  });
