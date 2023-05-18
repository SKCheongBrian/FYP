import "./App.css";

import { useState } from "react";

import Editor from "./components/editor/editor";

function App() {
    const [program, setProgram] = useState("");
    const [stuff, setStuff] = useState("");
    function onClick() {
        // const tree = parser.parse(program);
        // console.log(JSON.stringify(tree));
        // plantuml.gen(tree);
        setStuff(program);
    }

    return (
        <div className="App">
            <h1>Hi swaggyhearts</h1>
            <div className="rowC">
                <div className="editor">
                    <h2 style={{ textAlign: 'left', margin: 0 }}>Editor</h2>
                    <Editor setProgram={setProgram} />
                    <div className="submit-bar" style={{ display: 'flex' }}>
                        <button style={{ marginLeft: 'auto' }} onClick={onClick}>Why</button>
                    </div>
                </div>
                <div className="diagram-area">
                    <h2 style={{ textAlign: 'left', margin: 0 }}>Diagram</h2>
                    <div style={{ color: "white" }}>{stuff}</div>
                </div>
            </div>
        </div>
    );
}

export default App;
