process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const chai = require("chai");
const server = require("../app");
const chaiHttp = require("chai-http");
const Portfolio = require("../portfolio/portfolioModel");

const should = chai.should();

chai.use(chaiHttp);

describe("Portfolio", () => {
  beforeEach(done => {
    var newPortfolio = new Portfolio({
      capital: 1000000,
      positions: [],
      startDate: Date.now(),
      name: "test",
      limit: 20
    });
    newPortfolio.save(err => {
      done();
    });
  });

  afterEach(done => {
    Portfolio.collection.drop();
    done();
  });

  it("should list portfolio at /portfolio GET", done => {
    chai
      .request(server)
      .get("/portfolio")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("array");
        res.body[0].should.have.property("_id");
        res.body[0].should.have.property("capital");
        res.body[0].capital.should.equal(1000000);
        res.body[0].should.have.property("positions");
        res.body[0].should.have.property("startDate");
        res.body[0].should.have.property("timestamps");
        res.body[0].should.have.property("name");
        res.body[0].should.have.property("limit");
        res.body[0].should.have.property("updatedDate");
        done();
      });
  });

  it("should add a SINGLE portfolio on /portfolio POST", done => {
    chai
      .request(server)
      .post("/portfolio")
      .send({
        capital: 15623523,
        name: "test",
        limit: 20
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("SUCCESS");
        res.body.SUCCESS.should.be.a("object");
        res.body.SUCCESS.should.have.property("capital");
        res.body.SUCCESS.should.have.property("positions");
        res.body.SUCCESS.should.have.property("name");
        res.body.SUCCESS.should.have.property("limit");
        res.body.SUCCESS.should.have.property("startDate");
        res.body.SUCCESS.should.have.property("updatedDate");
        res.body.SUCCESS.should.have.property("_id");
        res.body.SUCCESS.capital.should.equal(15623523);
        res.body.SUCCESS.limit.should.equal(20);
        res.body.SUCCESS.name.should.equal("test");
        done();
      });
  });

  it("should list a SINGLE portfolio on /portfolio/<id> GET", done => {
    var newPortfolio = new Portfolio({
      name: "Super",
      capital: 65465456,
      limit: 30
    });
    newPortfolio.save((err, data) => {
      chai
        .request(server)
        .get("/portfolio/" + data.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name");
          res.body.should.have.property("capital");
          res.body.name.should.equal("Super");
          res.body.capital.should.equal(65465456);
          res.body.limit.should.equal(30);
          res.body._id.should.equal(data.id);
          done();
        });
    });
  });

  it("should update a SINGLE portfolio on /portfolio/<id> PUT", done => {
    chai
      .request(server)
      .get("/portfolio")
      .end((err, res) => {
        chai
          .request(server)
          .put("/portfolio/" + res.body[0]._id)
          .send({ name: "fjotlo" })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.should.have.property("UPDATED");
            res.body.UPDATED.should.have.property("capital");
            res.body.UPDATED.should.have.property("positions");
            res.body.UPDATED.should.have.property("name");
            res.body.UPDATED.should.have.property("limit");
            res.body.UPDATED.should.have.property("startDate");
            res.body.UPDATED.should.have.property("updatedDate");
            res.body.UPDATED.should.have.property("_id");
            res.body.UPDATED.capital.should.equal(1000000);
            res.body.UPDATED.name.should.equal("fjotlo");
            done();
          });
      });
  });
});
