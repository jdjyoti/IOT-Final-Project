import React, { Component } from 'react'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import mqtt from 'mqtt';

var client;

class Data extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beaconList: [],
      error: ''
    };
  }
  componentDidMount() {
    const settings = {
      port: 8080,
      clientId: 'dashboard'
    };
    client = mqtt.connect('mqtt://localhost', settings);
    client.on('connect', function () {
      client.subscribe('/dashboard');
    });
    setInterval(this.getPublishedMessage, 3000);
  }


  getPublishedMessage = () => {
    let that = this;
    client.on('message', function (topic, message) {
      try {
        that.setState({showModal : false})
        let beaconArr = JSON.parse(message.toString());
        if (typeof beaconArr["beacons"] === 'object' && beaconArr["beacons"].length > 0) {
          that.setState({ beaconList: beaconArr["beacons"] });
        }
      } catch (err) {
        if (message.toString().includes("crowd")) {
          that.setState({ error: message.toString() });
        }
        else {
          that.setState({ error: '' });
        }
      }
    });
  }

  render() {
    let { beaconList, error } = this.state;
    let dataSize;
    if (beaconList.length == 0) {
      dataSize = "The building is empty"
    } else {
      dataSize = null;
    }
    const data_minimal_width = {
      columns: [
        {
          label: 'Beacon ID',
        },
        {
          label: 'Student\'s Matricula',
        },
        {
          label: 'Entry Time',
        },
        {
          label: 'Room Number',
        }
      ],
      rows: beaconList
    };
    if (dataSize) {
      return (
        <div className="content">
          <div className="container-fluid">
            <h3 style={{color: "white"}}>{dataSize}</h3>
          </div>
        </div>
      );
    } else {
      return (
        <div>
            <h3>
            </h3>
            <MDBTable style={{color: "white"}}>
              <MDBTableHead columns={data_minimal_width.columns} />
              <MDBTableBody rows={data_minimal_width.rows} />
            </MDBTable>
            </div>
      );
    }
  };
}

export default Data;