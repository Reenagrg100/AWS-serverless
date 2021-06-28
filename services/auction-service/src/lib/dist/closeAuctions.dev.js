"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeAuctions = closeAuctions;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function closeAuctions(auction) {
  var params, result;
  return regeneratorRuntime.async(function closeAuctions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          params = {
            TableName: process.env.AUCTIONS_TABLE,
            Key: {
              id: auction.id
            },
            UpdateExpression: " set #status = :status ",
            ExpressionAttributeValues: {
              ":status": "CLOSED"
            },
            ExpressionAttributeNames: {
              "#status": "status"
            }
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(dynamoDb.update(params).promise());

        case 3:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}