import React from 'react';
import './App.css';
const d3 = require("d3");

class MortalityTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        data: [],
        countries: [],
        max_mortality: undefined,
        min_mortality: undefined,
        years: []
      },
      circleRange: d3.scaleLinear(),
      maxRadius: 25,
      minRadius: 0.2,
      expanded: false
    };

    this.toggleExpansion = this.toggleExpansion.bind(this)
    this.toolTipMouseOver = this.toolTipMouseOver.bind(this)
    this.toolTipMouseOut = this.toolTipMouseOut.bind(this)
    this.renderCircle = this.renderCircle.bind(this)
  }

  componentDidMount() {
    fetch("./data.json")
      .then(res => res.json())
      .then(json => {
        this.setState({data: json})
        this.setState({
          circleRange: d3.scaleLinear()
            .domain([json.min_mortality, json.max_mortality])
            .range([this.state.minRadius, this.state.maxRadius])
        })
      })
      .catch((e) => {console.error(e);});
  }

  toolTipMouseOver(event) {
    const dataRow = event.target.getAttribute("data-row")
                const dataColumn = event.target.getAttribute("data-column")
                d3.select("#tooltip")
                  .style("display", "block")
                  .style("top", `${event.pageY}px`)
                  .style("left", `${event.pageX}px`)
                d3.select("#tooltip-country")
                  .text(this.state.data.countries[dataRow])
                d3.select("#tooltip-rate")
                  .text(this.state.data.data[dataRow][dataColumn])
  }

  toolTipMouseOut(_e) {
      d3.select("#tooltip").style("display", "none")
  }

  renderCircle(circleSize, dataRow, dataColumn) {
    const circleTranslation = `translate(${this.state.maxRadius + 5}, ${this.state.maxRadius + 5})`
    return (
      <svg role="img" width={this.state.maxRadius * 2 + 10} height={this.state.maxRadius * 2 + 10}>
        <title>{circleSize} maternal deaths per 100,000 live births</title>
        <g transform={circleTranslation}>
          <circle
            data-row={dataRow} data-column={dataColumn} className="gfx__circle gfx__data"
            r={this.state.circleRange(circleSize)} onMouseOver={this.toolTipMouseOver} onMouseOut={this.toolTipMouseOut}>
          </circle>
        </g>
      </svg>
    )
  }

  toggleExpansion() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    return (
      <div>
        <div className="gfx__legend" aria-hidden="true">
          <svg width="125" height="90">
            <text transform="translate(35,80)">{this.state.data.min_mortality}</text>
            <circle className="gfx__circle" cx={this.state.maxRadius + 10} cy={this.state.maxRadius + 10} r={this.state.minRadius}></circle>
          </svg>
          <svg width="125" height="90">
            <text transform="translate(20,80)">{this.state.data.max_mortality}</text>
            <circle className="gfx__circle" cx={this.state.maxRadius + 10} cy={this.state.maxRadius + 10} r={this.state.maxRadius}></circle>
          </svg>
          <div>Maternal deaths per 100,000 live births.</div>
          <div className="gfx__credit">Source: World Bank Gender Data</div>
        </div>
        <table>
        <thead>
          <tr>
          <th>Country</th>
          {this.state.data.years.map((year, idx) => (<th key={idx}>{year}</th>))}
          </tr>
        </thead>
        <tbody id="mortality-table">
          {this.state.data.countries.map((country, idx) => {
            if (this.state.expanded || idx < 10) {
              return (<tr key={country}>
                <td className="country-selection"><b>{country}</b></td>
                {this.state.data.data[idx].map((dataCell, dataIdx) => <td>{this.renderCircle(dataCell, idx, dataIdx)}</td>)}
              </tr>)
            }
          })}
        </tbody>
      </table>
      <button type="button" className="expand__button" onClick={this.toggleExpansion}>{this.state.expanded ? 'Shrink' : 'Expand'} Country List</button>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <h1>Maternal Mortality Across the World</h1>
      <MortalityTable></MortalityTable>
      <div id="tooltip">
        <p><span id="tooltip-country"></span></p>
        <p><span id="tooltip-rate"></span> maternal deaths per 100,000 live births.</p>
      </div>
    </div>
  );
}

export default App;
