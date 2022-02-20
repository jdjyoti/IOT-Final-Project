import React, { Component } from 'react'
import '../assets/css/styles.css';
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beaconAliveTime: [],
      noActiveBeacons: [],
    }
  }

  componentDidMount() {
    this.getBeaconData();
  }

  getBeaconData = () => {
    fetch('http://localhost:5000/beacon/active/duration', {
      method: 'GET',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          beaconAliveTime: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });

    fetch('http://localhost:5000/beacon/active/count', {
      method: 'GET',
      mode: 'cors'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          noActiveBeacons: responseJson
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      value,
      index
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${value}`}
        </text>
      );
    };
    let { beaconAliveTime, noActiveBeacons } = this.state;

    return (
      <div className="container">
        <div className="card ">
          <div className="card-header ">
            <h4 className="card-title">Beacons Per Room</h4>
          </div>
          <PieChart width={400} height={400}>
            <Legend
              payload={
                Array.from(noActiveBeacons).map(
                  (item, index) => ({
                    id: item.name,
                    type: "square",
                    value: `Room ${item.name}`,
                    color: COLORS[index % COLORS.length]
                  })
                )
              }
            />
            <Pie
              data={noActiveBeacons}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {Array.from(noActiveBeacons).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="card">
          <div className="card-header ">
            <h4 className="card-title">Beacon Duration</h4>
          </div>
          <BarChart
            width={700}
            height={400}
            data={beaconAliveTime}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    );
  }
}

export default Dashboard