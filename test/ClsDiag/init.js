function parse(value) {
  let ast = parser.parse(value);
  console.log(ast);
  const types = [];
  for(const type of ast.types) {
    types.push(type);
  }
  mermjs.gen(types);
}

$j(document).ready(function() {
  mermaid.mermaidAPI.initialize({ startOnLoad:false });
  
  code_editor = editor("erd_code", {mode: "ace/mode/java", theme:"ace/theme/monokai"});
  cons_editor = editor("cons", {write:false, number:false, theme:"ace/theme/monokai", mode: "ace/mode/text"});
  
  function erd_to_graph() {
    cons_editor.load('');
    code_editor.err(-1);
    document.getElementById('graph').innerHTML = '';
    try {
      parse(code_editor.value());
    } catch(e) {
      let msg = 'Unknown error';
      let loc = -1;
      try {
        msg = e.message ?? e;
        loc = e.location.start.line-1;
      } catch(_e) {}
      cons_editor.load(msg);
      code_editor.err(loc);
    }
  }
  
  $j("#compile").click(erd_to_graph);
  document.addEventListener('keydown', (event) => {
    if(event.ctrlKey && event.key == "Enter") {
      erd_to_graph();
    }
  });
  document.getElementById("upload").addEventListener('change', code_editor.read, false);
  
  function dlCanvas() {
    let cvs = document.getElementById('graph');
    cvs = cvs.getElementsByTagName('canvas');
    cvs = cvs[cvs.length-1];
    let png = cvs.toDataURL('image/png');
    png = png.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    
    let link = document.createElement('a');
    link.setAttribute('href', png);
    link.setAttribute('download', 'erd.png');
    if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      link.dispatchEvent(event);
    } else {
      link.click();
    }
  }
  
  const PARAMS = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  function init() {
    try {
      const cd = PARAMS.c;
      code_editor.load(cd);
      erd_to_graph();
    } catch(e) { }
  }
  init();
  
  document.getElementById('dl').addEventListener('click', downloadSVG, false);
});
