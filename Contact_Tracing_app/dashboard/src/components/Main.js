import React, { Component } from 'react'
import Dashboard from './Dashboard'
import Data from './Data'

class Main extends Component {
  render() {
    return (
      <div style={{
        display: "flex", flexWrap: "wrap"
      }}>
        <div style={{
          flex: "0 50%",
          padding: "10px"
        }}>
          <Data />
        </div>
        <div style={{
          flex: "0 50%",
          padding: "10px"
        }}>
          <Dashboard />
        </div>
      </div>
    )

    
  }
}

export default Main