import React, { Component } from "react";
import axios from "axios";

import "./App.css";

import Region from "./components/Region";
import Trees from "./components/Trees";
// import { timingSafeEqual } from "crypto";

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
      currentArray: []
    };
    this.getResult = this.getResult.bind(this);
    this.refineResult = this.refineResult.bind(this);
    this.mergeTrees = this.mergeTrees.bind(this);
  }

  componentDidMount() {
    // this.getResult();
    this.getTrees();
  }

  getTrees = async () => {
    try {
      await this.getResult();
      console.log("object");
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

      // var list = ["foo", "bar"];
      // list.splice( 1, 0, "baz"); // at index position 1, remove 0 elements, then add "baz" to that position
      // element "bar" will now automatically be moved to index position 2
      // ["foo", "baz", "bar"] // result
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
          '<item>\n'+
          '<label ref=\"jr:itext(\'/data/Trees_dataName:option' +
          index +
          '\')"/>\n      <value>' +
          'tree_' +
          index +
          "</value>\n    </item>";
        return newElem;
      });

      //     var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
      // var removed = myFish.splice(2, 0, 'drum');

      // myFish равен ["angel", "clown", "drum", "mandarin", "sturgeon"]
      // removed равен [], ничего не удалено

      this.setState({ currentArray: mergeTrees3, treesDBArray: mergeTrees4, treesDBArray2: mergeTrees5 }, () =>
        this.refineResult()
      );
    } catch (error) {
      console.error(error);
    }
  };

  mergeTrees = () => {
    console.log('object')
    const array = this.state.currentArray;
    // const array1 = this.state.treesDBArray.map((elem, index, array) => {
    //   const currentArray = this.state.currentArray;
    //   const array1 = currentArray.splice(currentArray.indexOf("          <text id=\"/data/Trees_dataName:label\">")+3+index, 0, elem);
    //   return array1;
    // })
    const array1 = array.splice(array.indexOf("          <text id=\"/data/Trees_dataName:label\">")+3, 0, this.state.treesDBArray);
    const array2 = array.splice(array.indexOf("    <select ref=\"/data/Trees_dataName\">")+3, 0, this.state.treesDBArray2);
    // console.log(array.indexOf('<text id="/data/Trees_dataName:label">')+3);
    const tempTrees = array.join('\n');
    const tempTrees2 = tempTrees.replace(/<\/text>,/g, '<\/text>\n').replace(/<\/item>,/g, '<\/item>\n');
    // const tempTrees3 = tempTrees2.replace(/<\/item>,/g, '<\/item>\n');
    const tempTreesArray = tempTrees2.split('\n');
    this.setState({ currentArray: tempTreesArray })
    console.log(tempTrees2)
  };

  getResult = async () => {
    try {
      // const form = axios.get('http://192.168.20.227:8080/www/formXml?formId=build_Untitled-Form_1548652707');
      const form = await axios.get(require("./Forms/Form.xml"));
      const preTreesDB = await axios.get(require("./Forms/Trees.txt"));
      const treesDB2 = preTreesDB.data;
      const treesDB = treesDB2.split("\n");
      const form2 = form.data;
      this.setState({ xml: form2, treesDB: treesDB }, () =>
        this.refineResult()
      );
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
