import { uniqueId } from "lodash";

function createGlobalEnvironment() {
  return {
    tail: null,
    bindings: {},
    id: -1,
  };
}

const interpreter = (function () {
  let environment = createGlobalEnvironment();

function createBlockEnvironment() {
  return {
    tail: environment,
    bindings: {},
    id: uniqueId(),
  }
}


  // keeps track of instructions that still need to be evaluated
  const agenda = [];
  // stack to keep temporary variables (different from runtime stack)
  const executionStack = [];

  function execute(node) {
    switch (node.node) {
      case "block":
        const newEnv = createBlockEnvironment();
        environment = newEnv;
        break;

      default:
        throw new Error("unknown node type");
    }
  }
})();

export default interpreter;
