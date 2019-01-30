import React, { Component } from "react";
import axios from "axios";

import "./App.css";

import Region from "./components/Region";
// import { timingSafeEqual } from "crypto";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: "",
      array1: [],
      region: [1, 2]
    };
    this.getResult = this.getResult.bind(this);
    this.refineResult = this.refineResult.bind(this);
  }

  componentDidMount() {
    this.getResult();
  }

  getResult = async () => {
    try {
      // const form = axios.get('http://192.168.20.227:8080/www/formXml?formId=build_Untitled-Form_1548652707');
      const form = await axios.get(require("./Forms/Form.xml"));
      const form2 = form.data;
      this.setState({ xml: form2 }, () => this.refineResult());
    } catch (error) {
      console.error(error);
    }
  };

  refineResult() {
    const xml = this.state.xml;
    const array1 = xml.split("\n");
    const region = array1.map((elem, index, array) => {
      if (elem.includes('<text id="/data/Region_dataname:option'))
        return array[index + 1];
    });
    const region2 = region.filter(elem => {
      if (elem) return true;
    });
    const region3 = region2.map(elem => {
      elem = elem.substr(19);
      elem = elem.substr(0, elem.indexOf("/value") - 1);
      return elem;
    });
    this.setState({ region: region3 });
    const array2 = array1.filter(elem => {
      if (elem.includes("_label")) return true;
    });
    this.setState({ array1: array2 });
  }

  render() {
    console.log(this.state.region);
    return (
      <div className="App">
        <div className="BlankForm">
          <p>Бланки</p>
          <div>Бланк 1</div>
          <div>
            <button>Область</button>
            <div>
              {this.state.region.map((elem, index) => {
                return (
                  <div key={index}>
                    <Region region={elem} />
                  </div>
                );
              })}
            </div>
            <button>Лесхоз</button>
            <button>Лесничество</button>
            <button>Квартал</button>
            <button>Выдел</button>
            <button>Деревья</button>
          </div>
        </div>
        {/* <div className="Divider">divide</div> */}
        <div className="Directory">
          <p>Справочники</p>
        </div>
      </div>
    );
  }
}

export default App;
