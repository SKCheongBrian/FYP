import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/ext-language_tools";

function Editor(props: {setProgram: (val: string) => void}) {
  const setProgram = props.setProgram
  function onChange(text: string) {
    setProgram(text);
  }

  return (
    <AceEditor
      mode="java"
      theme="pastel_on_dark"
      tabSize={2}
      onChange={onChange}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        enableBasicAutocompletion: true,
      }}
    />
  );
}

export default Editor;
