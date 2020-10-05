import React from 'react';
import './App.css';
const d3 = require("d3");

class MortalityTable extends React.Component {
  constructor(props) {
    super(props);
    this.fileName = props.fileName;
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
    };

    this.toolTipMouseOver = this.toolTipMouseOver.bind(this)
    this.toolTipMouseOut = this.toolTipMouseOut.bind(this)
    this.renderCircle = this.renderCircle.bind(this)
  }

  componentDidMount() {
    fetch(this.fileName)
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
              return (<tr key={country}>
                <td className="country-selection"><b>{country}</b></td>
                {this.state.data.data[idx].map((dataCell, dataIdx) => <td>{this.renderCircle(dataCell, idx, dataIdx)}</td>)}
              </tr>)
          })}
        </tbody>
      </table>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <h1>Maternal Mortality Across the World</h1>
      <h2>Income</h2>
      <p>Maternal mortality rates are far worse in lower-income countries than they
        are in higher-income countries. While some countries like Norway have had
        mortality rates as low as 2 maternal deaths for every 100,000 live births,
        Chad, Sierra Leone, and South Sudan have consistently had maternal mortality
        rates of 1,000 deaths per 100,000 live births.
      </p>
      <MortalityTable fileName="./income.json"></MortalityTable>
      <h2>Decreasing Mortality</h2>
      <p>Still, some countries have had substantial improvements. Overall, maternal
        mortality slightly decreased from 2011 to 2017. And some countries like Afghanistan
        saw nearly 30 percent decreases in maternal mortality rates.
      </p>
      <MortalityTable fileName="./decreasing-mortality.json"></MortalityTable>
      <div id="tooltip">
        <p><span id="tooltip-country"></span></p>
        <p><span id="tooltip-rate"></span> maternal deaths per 100,000 live births.</p>
      </div>
    </div>
  );
}

export default App;
