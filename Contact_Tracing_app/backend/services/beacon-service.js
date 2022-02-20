export function autoCalculateExitedBeacons() {
  setInterval(
    function calculateExitedBeacons() {
      try {
        BeaconDetails.find({ is_active: true, room_no: '/101' }, { _id: 1, beaconId: 1 }, function (err, docs) {
          if (err) {
          }
          else {
            var activeBeaconsInDB = new Set();
            docs.forEach(element => {
              activeBeaconsInDB.add(element.beaconId);
            });
            var beaconsExited = calculateDiffExitedBeacons(activeBeaconsInDB, beaconSet);
            if (Array.from(beaconsExited).length > 0) {
              console.log("hello exited beacons", beaconsExited);
              Array.from(beaconsExited).forEach(beacon => {
                let filter = {
                  beaconId: beacon
                }
                let exitedBeacon = {
                  exit_time: new Date(),
                  is_active: false
                }
                BeaconDetails.findOneAndUpdate(filter, exitedBeacon, function (err, docs) {
                  if (err) {
                  }
                  else {
                  }
                });
              });
            }
          }
        });
      } catch (err) {
      }
    }, 30000);
}

function addToDb(topic, beaconSet) {
  try {
    if (Array.from(beaconSet).length > 0) {
      Array.from(beaconSet).forEach(beaconData => {
        let filter = {
          beaconId: beaconData,
          is_active: false
        }
        let updatedBeacon = {
          beaconId: beaconData,
          room_no: topic,
          entry_time: new Date(),
          exit_time: null,
          is_active: true
        }
        BeaconDetails.updateOne(filter, updatedBeacon, function (err, docs) {
          console.log("beacon added", docs);
        });
      });
    }
  } catch (err) {
  }
}

function calculateDiffExitedBeacons(beaconsInDb, beaconsActive) {
  let exitedSet = new Set();
  beaconsInDb.forEach(elem => exitedSet.add(elem));
  Array.from(beaconsActive).forEach(elem => exitedSet.delete(elem));
  return exitedSet;
}

export function calculateActiveBeacons(res) {
  BeaconDetails.aggregate(
    [{
      $match: {
        $and: [
          { is_active: true },
        ]
      }
    },
    {
      $group: {
        _id: "$room_no",
        count: {
          $sum: 1
        }
      },
    }, {
      $sort: { _id: 1 }
    }, {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$count"
      }
    }
    ],
    function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log(result);
        res.json(result);
      }
    }
  );
}

export function calculateDurationOfBeacons(res) {
  BeaconDetails.aggregate(
    [
      {
        $match: {
          $and: [
            { is_active: false },
            { $expr: { $eq: [new Date().getDate(), { $dayOfMonth: "$entry_time" }] } },
          ]
        }
      },
      {
        $project: {
          _id: 0,
          name: "$matricula",
          room_no: 1,
          duration: { $divide: [{ $subtract: ["$exit_time", "$entry_time"] }, 60000] }
        }
      }
    ],
    function (err, result) {
      if (err) {
        throw err;
      } else {
        console.log(result);
        res.json(result);
      }
    }
  );
}