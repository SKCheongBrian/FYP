mermjs =
  /**
   * Mermaid Generator
   */
  (function () {
    "use strict";

    function merm$gen(types, id = "graph") {
      let merm = "classDiagram\n";
      for (const type of types) {
        merm += merm$proc(type);
      }

      const elem = document.querySelector("#" + id);
      const svg = function (code, bind) {
        elem.innerHTML = code;
      };
      console.log(merm);
      const grph = mermaid.mermaidAPI.render("_" + id, merm, svg);
    }
    function merm$proc(type) {
      let res = "";
      let curr = ast$typedecl(type);
      // Superclass
      if (
        type.superclassType !== null &&
        typeof type.superclassType !== "undefined"
      ) {
        const sup = type.superclassType;
        res += `
${ast$type(sup)} <|-- ${curr}`;
      }
      // Superinterface
      if (
        type.superInterfaceTypes !== null &&
        typeof type.superInterfaceTypes !== "undefined"
      ) {
        for (const sup of type.superInterfaceTypes) {
          res += `
${ast$type(sup)} <|.. ${curr}`;
        }
      }
      // Definition
      const body = ast$body(type.bodyDeclarations);
      if (body !== "") {
        res += `
class ${curr} {${body}
}`;
      } else {
        res += `
class ${curr}`;
      }
      if (type.interface) {
        res += `
<<interface>> ${curr}`;
      }
      if (ast$is_abs(type.modifiers)) {
        res += `
<<abstract>> ${curr}`;
      }
      return res;
    }

    // AST
    function ast$typedecl(obj) {
      if (!obj) {
        return "";
      }
      let name = "",
        par = "";
      switch (obj.node) {
        case "TypeDeclaration":
          name = ast$name(obj.name);
          par = ast$typepar(obj.typeParameters);
          if (par !== "") {
            return `${name}~${par}~`;
          } else {
            return `${name}`;
          }
        default:
          throw `Unimplemented object node '${obj.node}' at ast$typedecl`;
      }
      return "";
    }
    function ast$typepar(arr) {
      if (!arr) {
        return "";
      }
      let name = "",
        bound = "",
        res = [];
      for (const obj of arr) {
        switch (obj.node) {
          case "TypeParameter":
            name = ast$name(obj.name);
            // TODO: bound
            res.push(name);
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$typepar`;
        }
      }
      return res.join(", ");
    }
    function ast$type(obj) {
      if (!obj) {
        return "";
      }
      let args = [];
      switch (obj.node) {
        case "SimpleType":
          const name = ast$name(obj.name);
          if (name === "unknown") {
            return "☐";
          } else {
            return name;
          }
        case "PrimitiveType":
          return obj.primitiveTypeCode;
        case "WildcardType":
          return "?";
        case "ParameterizedType":
          for (const arg of obj.typeArguments) {
            args.push(ast$type(arg));
          }
          return `${ast$type(obj.type)}~${args.join(", ")}~`;
        case "ArrayType":
          return `${ast$type(obj.componentType)}[]`  
        default:
          throw `Unimplemented object node '${obj.node}' at ast$type`;
      }
    }

    function ast$name(obj) {
      if (!obj) {
        return "";
      }
      switch (obj.node) {
        case "SimpleName":
          return obj.identifier;
        default:
          throw `Unimplemented object node '${obj.node}' at ast$name`;
      }
      return "";
    }
    function ast$frag(arr) {
      if (!arr) {
        return "";
      }
      let res = [];
      for (const obj of arr) {
        switch (obj.node) {
          case "VariableDeclarationFragment":
            res.push(ast$name(obj.name));
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$frag`;
        }
      }
      return res;
    }
    function ast$singlevar(obj) {
      if (!obj) {
        return "";
      }
      switch (obj.node) {
        case "SingleVariableDeclaration":
          return `${ast$type(obj.type)} ${ast$name(obj.name)}`;
        // return `${ast$name(obj.name)} : ${ast$type(obj.type)}`;
        default:
          throw `Unimplemented object node '${obj.node}' at ast$singlevar`;
      }
      return "";
    }

    function ast$is_abs(arr) {
      if (!arr) {
        return false;
      }
      for (const obj of arr) {
        switch (obj.node) {
          case "Modifier":
            switch (obj.keyword) {
              case "abstract":
                return true;
            }
            break;
          case "MarkerAnnotation":
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$is_abs`;
        }
      }
      return false;
    }
    function ast$is_stc(arr) {
      if (!arr) {
        return false;
      }
      for (const obj of arr) {
        switch (obj.node) {
          case "Modifier":
            switch (obj.keyword) {
              case "static":
                return true;
            }
            break;
          case "MarkerAnnotation":
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$is_stc`;
        }
      }
      return false;
    }

    function ast$vis(arr) {
      if (!arr) {
        return "";
      }
      for (const obj of arr) {
        console.log(obj);
        switch (obj.node) {
          case "Modifier":
            switch (obj.keyword) {
              case "public":
                return "+";
              case "private":
                return "-";
              case "protected":
                return "#";
              case "package":
                return "~";
              case "internal":
                return "~";
              // default:
              // throw `Unimplemented object keyword '${obj.keyword}' at ast$vis :: Modifier`;
            }
            break;
          case "MarkerAnnotation":
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$vis`;
        }
      }
      return "";
    }
    function ast$fld(obj) {
      if (!obj) {
        return "";
      }
      let vis = "",
        typ = "",
        res = [];
      switch (obj.node) {
        case "FieldDeclaration":
          vis = ast$vis(obj.modifiers);
          typ = ast$type(obj.type);
          res = ast$frag(obj.fragments);
          // let txt = '';
          // for(const f of res) {
          // txt += `
          // ${vis} ${f} : ${typ}`;
          // }
          // return txt;
          return (
            `
    ${vis}${typ} ` +
            res.join(`
    ${vis}${typ} `)
          );
        default:
          throw `Unimplemented object node '${obj.node}' at ast$fld`;
      }
      return "";
    }
    function ast$mth(obj) {
      if (!obj) {
        return "";
      }
      let vis = "",
        ret = "",
        name = "",
        args = [],
        mod = "";
      switch (obj.node) {
        case "MethodDeclaration":
          vis = ast$vis(obj.modifiers);
          ret = ast$type(obj.returnType2);
          name = ast$name(obj.name);
          for (const arg of obj.parameters) {
            args.push(ast$singlevar(arg));
          }
          mod = "";
          if (ast$is_abs(obj.modifiers)) {
            mod = "*";
          }
          if (ast$is_stc(obj.modifiers)) {
            mod = "$";
          }
          if (ret === "") {
            return `
    ${vis}${name}(${args.join(", ")})${mod}`;
          } else {
            return `
    ${vis}${name}(${args.join(", ")})${mod} ${ret}`;
          }
        default:
          throw `Unimplemented object node '${obj.node}' at ast$mth`;
      }
      return "";
    }

    function ast$body(arr) {
      if (!arr) {
        return "";
      }
      let fld = [],
        mth = [];
      for (const obj of arr) {
        switch (obj.node) {
          case "FieldDeclaration":
            fld.push(ast$fld(obj));
            break;
          case "MethodDeclaration":
            mth.push(ast$mth(obj));
            break;
          default:
            throw `Unimplemented object node '${obj.node}' at ast$body`;
        }
      }
      return fld.join("") + mth.join("");
    }

    return {
      gen: merm$gen,
    };
  })();
