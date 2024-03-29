import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Region from "./components/Region";
import Trees from "./components/Trees";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xml: "",
      array1: [],
      region: [],
      trees: [],
      newTrees: [],
      treesDB: [],
      treesDBArray: [],
      treesDBArray2: [],
      currentArray: [],
      currentXML: ""
    };
    this.getResult = this.getResult.bind(this);
    this.refineResult = this.refineResult.bind(this);
    this.mergeTrees = this.mergeTrees.bind(this);
    this.writeResult = this.writeResult.bind(this);
  }

  componentDidMount() {
    this.getTrees();
  }

  getTrees = async () => {
    try {
      await this.getResult();
      const array1 = this.state.xml.split("\n");
      const mergeTrees = array1.map((elem, index, array) => {
        if (elem.includes('<text id="/data/Trees_dataName:option0">')) {
          elem = "";
          array[index + 1] = "";
          array[index + 2] = "";
        }
        return elem;
      });
      const mergeTrees2 = mergeTrees.map((elem, index, array) => {
        if (elem.includes("jr:itext('/data/Trees_dataName:label')")) {
          array[index + 1] = "";
          array[index + 2] = "";
          array[index + 3] = "";
          array[index + 4] = "";
        }
        return elem;
      });
      const mergeTrees3 = mergeTrees2.filter(elem => {
        if (elem.length >= 1) return elem;
      });

      const mergeTrees4 = this.state.treesDB.map((elem, index, array) => {
        const newElem =
          '<text id="/data/Trees_dataName:option' +
          index +
          '">\n      <value>' +
          elem +
          "</value>\n    </text>";
        return newElem;
      });
      const mergeTrees5 = this.state.treesDB.map((elem, index, array) => {
        const newElem =
          "<item>\n" +
          "<label ref=\"jr:itext('/data/Trees_dataName:option" +
          index +
          "')\"/>\n      <value>" +
          "tree_" +
          index +
          "</value>\n    </item>";
        return newElem;
      });

      this.setState(
        {
          currentArray: mergeTrees3,
          treesDBArray: mergeTrees4,
          treesDBArray2: mergeTrees5
        },
        () => this.refineResult()
      );
    } catch (error) {
      console.error(error);
    }
  };

  mergeTrees = () => {
    console.log("object");
    const array = this.state.currentArray;
    const array1 = array.splice(
      array.indexOf('          <text id="/data/Trees_dataName:label">') + 3,
      0,
      this.state.treesDBArray
    );
    const array2 = array.splice(
      array.indexOf('    <select ref="/data/Trees_dataName">') + 2,
      0,
      this.state.treesDBArray2
    );
    const tempTrees = array.join("\n");
    const tempTrees2 = tempTrees
      .replace(/<\/text>,/g, "</text>\n")
      .replace(/<\/item>,/g, "</item>\n");
    const tempTreesArray = tempTrees2.split("\n");
    this.setState(
      { currentArray: tempTreesArray, currentXML: tempTrees2 },
      () => this.writeResult()
    );

    console.log(tempTrees2);
  };

  getResult = async () => {
    try {
      // const form = axios.get('http://192.168.20.227:8080/www/formXml?formId=build_Untitled-Form_1548652707');
      const form = await axios.get(require("./Forms/Form.xml"));
      // const preTreesDB = await axios.get(require("./Forms/Trees.txt"));
      const preTreesDB = await axios.get("http://localhost:8080/foresttype/foresttype_ru");
      const treesDB2 = preTreesDB.data;
      const treesDB = treesDB2.split("splitPlace");
      const treesDB3 = treesDB.filter(elem => {
        if (elem.length > 0) return true;
      });
      const form2 = form.data;
      this.setState({ xml: form2, treesDB: treesDB3 }, () =>
        this.refineResult()
      );
    } catch (error) {
      console.error(error);
    }
  };

  writeResult = () => {
    var data = new Blob([this.state.currentXML], { type: "text/plain" });
    var csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "filename.xml");
    tempLink.click();
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

    const trees = array1.map((elem, index, array) => {
      if (elem.includes('<text id="/data/Trees_dataName:option'))
        return array[index + 1];
    });
    const trees2 = trees.filter(elem => {
      if (elem) return true;
    });
    const trees3 = trees2.map(elem => {
      elem = elem.substr(19);
      elem = elem.substr(0, elem.indexOf("/value") - 1);
      return elem;
    });
    this.setState({ trees: trees3 });

    const array2 = array1.filter(elem => {
      if (elem.includes("_label")) return true;
    });
    this.setState({ array1: array2 });
  }

  render() {
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
            <div>
              {this.state.trees.map((elem, index) => {
                return (
                  <div key={index}>
                    <Trees trees={elem} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* <div className="Divider">divide</div> */}
        <div className="Directory">
          <p>Справочники</p>
          <button onClick={this.mergeTrees}>Merge</button>
        </div>
      </div>
    );
  }
}

export default App;
