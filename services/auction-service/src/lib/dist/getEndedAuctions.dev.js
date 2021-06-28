"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndedAuctions = getEndedAuctions;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function getEndedAuctions() {
  var now, params, result;
  return regeneratorRuntime.async(function getEndedAuctions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          now = new Date();
          params = {
            TableName: process.env.AUCTIONS_TABLE,
            IndexName: "statusAndEndDate",
            KeyConditionExpression: "#status = :status AND endingAt <= :now",
            //#status means status is a reserved keyword for dynamodb
            ExpressionAttributeValues: {
              ":status": "OPEN",
              ":now": now.toISOString()
            },
            ExpressionAttributeNames: {
              "#status": "status"
            }
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(dynamoDb.query(params).promise());

        case 4:
          result = _context.sent;
          return _context.abrupt("return", result.Items);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}