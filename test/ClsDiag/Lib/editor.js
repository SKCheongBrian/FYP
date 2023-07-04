editor =
/**
 * Helper for ACE Editor
 */
(function(div, opt={}) {
  let mode   = opt.mode   ?? 'ace/mode/text';
  let size   = opt.size   ?? '11pt';
  let theme  = opt.theme  ?? 'ace/theme/chrome';
  let write  = opt.write  ?? true;
  let number = opt.number ?? true;
  let pc_num = opt.pc_num ?? false;
  let acedit = ace.edit(div);
  let brkpts = [];
  let p_line = -1;
  let p_next = -1;
  let p_err  = -1;
  let p_rng  = undefined;
  let Range  = ace.require('ace/range').Range;
  
  function trim_hex(num) {
    if(num === 0) {
      return "0x0";
    } else {
      let hex = int32.toHex(int32.num(num));
      let lst = 0;
      for(let i=2; i<hex.length; i++) {
        if(hex[i] !== "0") {
          lst = i; break;
        }
      }
      return "0x" + hex.slice(lst);
    }
  }
  
  function init() {
    if(mode === 'ace/mode/mips') {
      ace.config.set('basePath',"./Lib/Editor");
    } else {
      ace.config.set('basePath',"https://pagecdn.io/lib/ace/1.4.12/");
    }
    acedit.setTheme(theme);
    acedit.getSession().setUseWorker(false);
    acedit.getSession().setUseWrapMode(true);
    acedit.$blockScrolling = Infinity;
    acedit.setOptions({fontSize: size});
    acedit.session.setMode(mode);
    if(write) {
      acedit.setReadOnly(false);
    } else {
      acedit.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});
      acedit.getSession().selection.on('changeSelection', function(e){
          acedit.getSession().selection.clearSelection();
          acedit.selection.moveCursorToPosition({row:p_line, column:0});
      });
    }
    acedit.renderer.setShowGutter(number);
    if(pc_num) {
      acedit.session.gutterRenderer =  {
        getWidth: function(session, last, config) {
          return trim_hex(last * 4).length * config.characterWidth;
        },
        getText: function(session, row) {
          return trim_hex(row * 4);
        }
      };
    }
    acedit.on("guttermousedown", function(e) {
      let target = e.domEvent.target; 
      if (target.className.indexOf("ace_gutter-cell") == -1)
          return; 
      if (!acedit.isFocused()) 
          return; 
      if (e.clientX > 25 + target.getBoundingClientRect().left) 
          return; 

      let row = e.getDocumentPosition().row;
      if(brkpts[row] === undefined) {
        e.editor.session.setBreakpoint(row);
        brkpts[row] = 0;
      } else {
        e.editor.session.clearBreakpoint(row);
        brkpts[row] = undefined;
      }
      e.stop();
    });
  }
  
  function base(hex) {
    if(pc_num) {
      let b_val = int32.toNum(int32.hex(hex));
      acedit.session.gutterRenderer =  {
        getWidth: function(session, last, config) {
          return trim_hex(last * 4 + b_val).length * config.characterWidth;
        },
        getText: function(session, row) {
          return trim_hex(row * 4 + b_val);
        }
      };
    }
  }
  
  function value() {
    return acedit.getValue();
  }
  function load(txt) {
    acedit.setValue(txt,1);
  }
  function save(file, pre=((x)=>x)) {
    return function() {
      let link = document.createElement('a');
      link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pre(value())));
      link.setAttribute('download', file);
      if (document.createEvent) {
        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
  }
  function read(evt) {
    let file = evt.target.files[0];
    if(file) {
      let reader = new FileReader();
      reader.onload = function(evt) {
        load(evt.target.result);
      }
      reader.readAsText(file);
    }
  }
  function log(txt,end='\n') {
    load(value() + txt + end);
  }
  function mark(line) {
    if(p_line >= 0) {
      acedit.getSession().removeGutterDecoration(p_line, 'RD');
    }
    if(line >= 0) {
      acedit.getSession().addGutterDecoration(line, 'RD');
    }
    p_line = line;
  }
  function next(line) {
    if(p_rng !== undefined) {
      acedit.getSession().removeMarker(p_rng);
      p_rng = undefined;
    }
    if(line >= 0) {
      p_rng = acedit.getSession().addMarker(new Range(line, 0, line, 1), "WR", "fullLine");
    }
    p_next = line;
  }
  function err(line) {
    acedit.getSession().clearBreakpoints();
    if(line >= 0) {
      acedit.getSession().setBreakpoint(line);
    }
  }
  function RES() {
    mark(-1);
    next(-1);
    err(-1);
  }
  
  init();
  return {
    base : base ,
    value: value,
    load : load ,
    save : save ,
    read : read ,
    log  : log  ,
    mark : mark ,
    next : next ,
    err  : err  ,
    RES  : RES  ,
  };
});
