import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import "bulma/css/bulma.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: [],
      year: [],
      gender: [],
      selectedRegion: null,
      selectedYear: null,
      selectedGender: null,
      icNumber: null,
      isLoaded: false,
      copyText: 'Copy!'
    };
  }

  handleClick = () => {
    this.setState({
      copyText: 'Copy!'
    });

    let yearOnIC = this.state.selectedYear.slice(2);
    let monthOnIC = Math.floor(Math.random() * Math.floor(12) + 1)
      .toString()
      .padStart(2, "0");
    let dayOnIC = Math.floor(
      Math.random() * Math.floor(monthOnIC === "02" ? 28 : 30) + 1
    )
      .toString()
      .padStart(2, "0");
    const birthday = [yearOnIC, monthOnIC, dayOnIC].join("");

    let multiRegionCode = this.state.selectedRegion.split(",");
    const regionCode =
      multiRegionCode[Math.floor(Math.random() * multiRegionCode.length)];

    let fourLastNumberGenderBased =
      this.state.selectedGender === "MALE"
        ? Math.floor(Math.random() * Math.floor(5)) * 2 + 1
        : Math.floor(Math.random() * Math.floor(5)) * 2;
    const fourLastNumber =
      Math.floor(Math.random() * Math.floor(999))
        .toString()
        .padStart(3, "0") + fourLastNumberGenderBased.toString();

    const icNumber = [birthday, regionCode, fourLastNumber].join("-");

    this.setState({
      icNumber
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount = () => {
    let url = "data/states.json";
    axios
      .get(url)
      .then(response => {
        this.setState({
          region: response.data
        });
      })
      .catch(error => this.setState({ error }));

    let currentYear = new Date().getFullYear();
    let range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    this.setState({
      year: range(currentYear, currentYear - 70, -1)
    });

    let genderOption = ["MALE", "FEMALE"];
    this.setState({
      gender: genderOption
    });
  };

  disabledButton = () => {
    return this.state.selectedGender && this.state.selectedRegion && this.state.selectedYear;
  };

  render() {
    const stateList = this.state.region.map(state => (
      <option key={state.id} value={state.code}>
        {state.name}
      </option>
    ));
    const yearList = this.state.year.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
    const genderList = this.state.gender.map(g => (
      <option key={g} value={g}>
        {g}
      </option>
    ));

    return (
      <div>
        <div className="container">
          <section className="columns is-section-header">
            <div className="column is-full has-text-centered">
              <div className="container">
                <h1 className="title">Malaysia NRIC Generator</h1>
              </div>
            </div>
          </section>
          <section className="section">
            <div className="columns">
              <div className="column is-half is-offset-one-quarter">
                <div className="box has-background-info">
                  <div className="field">
                    <div className="control is-expanded">
                      <div className="select is-fullwidth">
                        <select
                          defaultValue={"DEFAULT"}
                          name="selectedRegion"
                          onChange={this.handleChange}
                        >
                          <option value="DEFAULT" disabled>
                            {" "}
                            Select State{" "}
                          </option>
                          {stateList}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control is-expanded">
                      <div className="select is-fullwidth">
                        <select
                          defaultValue={"DEFAULT"}
                          name="selectedYear"
                          onChange={this.handleChange}
                        >
                          <option value="DEFAULT" disabled>
                            Select Year
                          </option>
                          {yearList}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control is-expanded">
                      <div className="select is-fullwidth">
                        <select
                          defaultValue={"DEFAULT"}
                          name="selectedGender"
                          onChange={this.handleChange}
                        >
                          <option value="DEFAULT" disabled>
                            Select Gender
                          </option>
                          {genderList}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="control has-text-centered">
                    <button className="button is-primary" onClick={this.handleClick} disabled={!this.disabledButton()}>Generate!</button>
                  </div>
                  {this.state.icNumber &&
                  <div>
                    <div className="section is-result-padding">
                      <div className="container has-text-centered">
                        <h1 className="title">{this.state.icNumber}</h1>
                      </div>
                    </div>
                    <div className="control has-text-centered">
                      <button className="button is-link" onClick={() => {
                        navigator.clipboard.writeText(this.state.icNumber);
                        this.setState({copyText: 'Copied!'});
                        }}>
                        {this.state.copyText}
                      </button>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </section>
        </div>
        <footer className="footer has-backorund-white-bis">
          <div className="content has-text-centered">
            <p>
              React + Bulma project by <a href="amiruddin.ml">Amiruddin Roslam</a>.
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
