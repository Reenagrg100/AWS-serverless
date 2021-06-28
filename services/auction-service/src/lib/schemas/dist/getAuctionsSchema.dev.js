"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
//used to define your lambda request schema
var schema = {
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          "enum": ["OPEN", "CLOSED"],
          //if any value outside this array receives in the status then simply throws 400 error
          "default": "OPEN" //means if status is not defined then use this default value

        }
      }
    }
  },
  required: ["queryStringParameters"]
};
var _default = schema;
exports["default"] = _default;