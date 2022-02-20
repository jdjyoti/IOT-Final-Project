const router = require('express').Router();
let BeaconDetails = require('../model/beacon_Schema.model');
const { calculateDurationOfBeacons, calculateActiveBeacons } = require('../services/beacon-service');

router.route('/').get((req, res) => {
  BeaconDetails.find()
    .then(beacon => res.json(beacon))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/active/duration').get((req, res) => {
  try{
  calculateDurationOfBeacons(res);
  }catch(err){
    res.status(400).send(err);
  }
});

router.route('/active/count').get((req, res) => {
  try{
    calculateActiveBeacons(res);
  }catch(err){
      res.status(400).send(err);
    }
});

module.exports = router;