import "./App.css";

import { useState } from "react";

import Editor from "./components/editor/editor";

import parser from "./lib/parser/parser";

function App() {
  const [program, setProgram] = useState("");
  const [stuff, setStuff] = useState("");
  function onClick() {
    // const tree = parser.parse(program);
    // console.log(JSON.stringify(tree));
    // plantuml.gen(tree);
    console.log(parser.parse(program));
    setStuff(JSON.stringify(parser.parse(program)));
  }

  return (
    <div className="App" style={{position: "relative"}}>
      <div style={{width: 100, height: 55}}>
        <h1>Java</h1>
      </div>
      <div className="rowC">
        <div className="editor">
          <h2 style={{ textAlign: "left", margin: 0 }}>Editor</h2>
          <Editor setProgram={setProgram} />
          <div className="submit-bar" style={{ display: "flex" }}>
            <button style={{ marginLeft: "auto" }} onClick={onClick}>
              Generate
            </button>
          </div>
        </div>
        <div className="diagram-area">
          <h2 style={{ textAlign: "left", margin: 0 }}>Diagram</h2>
          <div style={{ color: "white" }}>{stuff}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
