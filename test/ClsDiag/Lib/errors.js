errors =
/**
 * Error Messages
 */
(function() {
  "use strict"
  /** Error Messages **/
  function errors$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }
  function errors$ArgumentError(msg,op,arg) {
    this.message = msg;
    this.op   = op;
    this.arg  = arg;
    this.name = "ArgumentError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, errors$ArgumentError);
    }
  }
  function errors$RuntimeError(msg,comp,arg) {
    this.message = msg;
    this.comp = comp;
    this.arg  = arg;
    this.name = "RuntimeError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, errors$RuntimeError);
    }
  }
  function errors$CompileError(msg,comp,arg,loc) {
    this.message = msg;
    this.comp = comp;
    this.arg  = arg;
    this.loc  = loc;
    this.name = "CompileError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, errors$CompileError);
    }
  }
  errors$subclass(errors$ArgumentError, Error);
  errors$subclass(errors$RuntimeError, Error);
  errors$subclass(errors$CompileError, Error);
  
  return {
    ArgumentError: errors$ArgumentError,
    RuntimeError : errors$RuntimeError,
    CompileError : errors$CompileError,
  };
})();
