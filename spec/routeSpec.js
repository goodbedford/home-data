
describe('Routes', function() {
  let request = require('request');
  let baseUrl = 'http://localhost:3000/api/homes';
  let homeToDelete;
  let newHome;
  let newRoom;
  describe('/api/homes', function() {
    describe('GET', function() {
      it("returns status code 200", function(done) {
        request.get(baseUrl, function(err, response, home) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
      it("returns array of homes", function(done) {
        request.get(baseUrl, function(err, response, home) {
          // console.log("home", home);
          expect(Array.isArray(JSON.parse(home))).toBe(true);
          done();
        });
      })
    });
    describe("POST", function() {
      it("returns status code 201", function(done) {
        request.post({url:baseUrl, form: {name:"love place"}},function(err, response, home) {
          // console.log("new home:", home)
          homeToDelete = JSON.parse(home);
          expect(response.statusCode).toEqual(201);
          done();
        });
      });
    });
  });
  describe("/api/homes/:id", function() {
    describe("GET", function() {
      it("returns status code 200", function(done) {
        request.get(`${baseUrl}/${homeToDelete._id}`,function(err, response, home) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
    });
    describe("DELETE", function() {
      it("returns status code 200", function(done) {
        request.delete(`${baseUrl}/${homeToDelete._id}`,function(err, response, home) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
    });
  });
  describe("/api/homes/:id/rooms", function() {
    request.post({url:baseUrl, form: {name:"peace house"}},function(err, response, home) {
      // console.log("new home:", home);
      newHome = JSON.parse(home);
    });
    describe("POST", function() {
      it("returns status code 201", function(done) {
        request.post({url:`${baseUrl}/${newHome._id}/rooms`, form: {name:"new room"}},function(err, response, room) {
          newRoom = JSON.parse(room);
          expect(response.statusCode).toEqual(201);
          done();
        });
      });
    });
    describe("GET", function() {
      let foundRooms;
      it("returns status code 200", function(done) {
        request.get(`${baseUrl}/${newHome._id}/rooms`,function(err, response, rooms) {
          foundRooms = JSON.parse(rooms);
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
      it("returns an array of rooms", function(done) {
        expect(Array.isArray(foundRooms)).toBe(true);
        done();
      });
    });
  });
  describe("/api/homes/:home_id/rooms/:id", function() {
    describe("GET", function() {
      it("returns status code 200", function(done) {
        request.get(`${baseUrl}/${newHome._id}/rooms/${newRoom._id}`,function(err, response, room) {
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
    });
    describe("PUT", function() {
      it("returns status code 200", function(done) {
        let updatedRoom = {
          name: "updated room",
          thermostat: 60,
          curtains: false,
          lights: false
        }
        request.put({url:`${baseUrl}/${newHome._id}/rooms/${newRoom._id}`, form: updatedRoom},function(err, response, room) {
          // console.log("update room", room);
          newRoom = JSON.parse(room);
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
      it("should update home with new id", function(done) {
        request.get(`${baseUrl}/${newHome._id}`, function(err, response, home) {
          console.log("new room", newRoom._id);
          done();
        });
      });
      it("room name should be updated", function(done) {
        expect(newRoom.name).toBe("updated room");
        done();
      });
      it("thermstat should increase", function(done) {
        newRoom.thermostat += 1;
        expect(newRoom.thermostat).toBe(61);
        done();
      });
      it("thermstat should decrease", function(done) {
        newRoom.thermostat -= 1;
        expect(newRoom.thermostat).toBe(60);
        done();
      });
      it("curtains should be true", function(done) {
        expect(newRoom.curtains).toBe(false);
        done();
      });
      it("lights should be true", function(done) {
        expect(newRoom.lights).toBe(false);
        done();
      });
    });
    describe("DELETE", function() {
      afterEach(function(done) {
        request.delete(`${baseUrl}/${newHome._id}`, function(err, response, home) {
          console.log("deleted", home);
          done();
        });
      });
      it("returns status code 200", function(done) {
        request.delete(`${baseUrl}/${newHome._id}/rooms/${newRoom._id}`,function(err, response, home) {
          // console.log("home after deleted room", home);
          expect(response.statusCode).toEqual(200);
          done();
        });
      });
    });
  });
});
