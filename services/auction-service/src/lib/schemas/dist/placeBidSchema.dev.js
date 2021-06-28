"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
//used to define your lambda request schema
var schema = {
  properties: {
    body: {
      type: "object",
      properties: {
        amount: {
          type: "string"
        }
      },
      required: ["amount"]
    }
  },
  required: ["body"]
};
var _default = schema;
exports["default"] = _default;