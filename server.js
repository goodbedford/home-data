let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let router = express.Router();
let port = process.env.PORT || 3000;
let mongoose = require('mongoose');
let dotenv = require('dotenv').load();
let db = require('./app/models/index');

//dotenv.config();
//mongoose.connect(process.env.DB_THERMOSTAT);


//`require('dotenv').load();`
//Then, after you reboot your server, you can access those secret variables in your code like so

    // server.js
    var superSecret = process.env.SUPERSECRET;
    console.log(process.env);
    var mongoAddress = 'mongodb://'+
        process.env.DB_USER+':'+
        process.env.DB_PASS+'@'+
        process.env.DB_HOST;
    mongoose.connect(mongoAddress);

// middleware

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    res.send(200);
  }
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.use(function(request, response, next) {
  //log router
  console.log("router is working");
  next();
});
// router
app.use("/api", router);
router.route('/homes')
  .get(function(request, response) {
    db.Home
      .find()
      .exec(function(err, home) {
        if(err) {
          response.send(err);
        }
        response.json(home);
      });
  })
  .post(function(request, response) {
    let home = new db.Home();
    home.name = request.body.name;

    home.save(function(err, home) {
      if(err) {
        response.status(404).send(err);
      }
      response.status(201).json(home);
    });
  });
router.route('/homes/:id')
  .get(function(request, response) {
    db.Home.findById(request.params.id, function(err, home) {
      if(err) {
        response.send(err);
      }
      response.json(home);
    });
  })
  .delete(function(request, response) {
    console.log("delete start", request.params)
    db.Home
      .findById(request.params.id)
      .exec(function(err, home) {
        if(err) {
          response.send(err);
        }
        home.rooms.forEach(function(roomId) {
          db.Room
            .findByIdAndRemove(roomId)
            .exec(function(err, room) {
              if(err) {
                response.send(err);
              }
              console.log('Deleted room ' + roomId);
            });
        });
        db.Home
        .findByIdAndRemove(home._id)
        .exec(function(err, deleted) {
          console.log("deleted", deleted);
          if(err) {
            response.send(err);
          }
          response.json({message: 'Deleted home ' + deleted._id});

        })
        // response.json({messag: 'Deleted' + id});
      });
  })
router.route('/homes/:home_id/rooms')
  .get(function(request, response) {
    db.Home
      .findById(request.params.home_id)
      .populate('rooms')
      .exec(function(err, home) {
        if(err) {
          response.send(err);
        }
        response.json(home.rooms);
      });
  })
  .post(function(request, response) {
    let room = new db.Room();
    room.name = request.body.name;
    room.thermostat = request.body.thermostat || room.thermostat;
    room.curtains = request.body.curtains || room.curtains;
    room.lights = request.body.lights || room.lights;

    db.Home
      .findById(request.params.home_id)
      .exec(function(err, home) {
        room.save(function(err, room) {
          if(err) {
            response.send(err);
          }
          home.rooms.push(room);
          home.save(function(err, home) {
            if(err) {
              response.send(err);
            }
            response.status(201).json(room);
          });
        });
      });
  });
router.route('/homes/:home_id/rooms/:id')
  .get(function(request, response) {
    db.Room
      .findById(request.params.id)
      .exec(function(err, room) {
        if(err) {
          response.send(err);
        }
        response.json(room);
      });
  })
  .put(function(request, response) {
    db.Room
      .findById(request.params.id)
      .exec(function(err, room) {
        room.name = request.body.name;
        room.thermostat = JSON.parse(request.body.thermostat);
        room.curtains = JSON.parse(request.body.curtains);
        room.lights = JSON.parse( request.body.lights);
        room.save(function(err, updatedRoom) {
          if(err) {
            response.send(err);
          }
          console.log("updated", updatedRoom)
          response.json(updatedRoom);
        });
      });
  })
  .delete(function(request, response) {
    console.log("delete start", request.params)
    db.Home
      .findById(request.params.home_id)
      .populate('rooms')
      .exec(function(err, home) {
        if(err) {
          response.send(err);
        }
        db.Room
          .findByIdAndRemove(request.params.id)
          .exec(function(err, room) {
            if(err) {
              response.send(err);
            }
            for(let i = 0; i < home.rooms.length; i ++) {
              if(home.rooms[i]._id == request.params.id) {
                home.rooms.splice(i, 1);
              }
            }
            home.save(function(err, home) {
              if(err) {
                response.send(err);
              }
              response.json(home);
            });
          });
      });
  });
app.route("*")
  .get(function(err, response) {
    response.redirect("/");
  });


app.listen(port, function() {
  console.log("app listening on port", port);
});
