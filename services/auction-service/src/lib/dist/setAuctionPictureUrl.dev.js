"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAuctionPictureUrl = setAuctionPictureUrl;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function setAuctionPictureUrl(id, pictureUrl) {
  var now, params, result;
  return regeneratorRuntime.async(function setAuctionPictureUrl$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          now = new Date();
          params = {
            TableName: process.env.AUCTIONS_TABLE,
            Key: {
              id: id
            },
            UpdateExpression: " set pictureUrl = :pictureUrl",
            ExpressionAttributeValues: {
              ":pictureUrl": pictureUrl
            },
            ReturnValues: "ALL_NEW"
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(dynamoDb.update(params).promise());

        case 4:
          result = _context.sent;
          return _context.abrupt("return", result);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}