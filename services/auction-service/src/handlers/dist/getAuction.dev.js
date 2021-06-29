"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuctionById = getAuctionById;
exports.handler = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function getAuctionById(id) {
  var auction, result;
  return regeneratorRuntime.async(function getAuctionById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Get auction :", id);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(dynamoDb.get({
            TableName: process.env.AUCTIONS_TABLE,
            Key: {
              id: id
            }
          }).promise());

        case 4:
          result = _context.sent;
          auction = result.Item;
          console.log("Query result:", auction);
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.info("Error:", _context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 13:
          if (auction) {
            _context.next = 15;
            break;
          }

          throw new _httpErrors["default"].NotFound("Auction with ".concat(id, " not found in table.."));

        case 15:
          return _context.abrupt("return", auction);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
}

function getAuction(event, context) {
  var id, auction;
  return regeneratorRuntime.async(function getAuction$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = event.pathParameters.id;
          _context2.next = 3;
          return regeneratorRuntime.awrap(getAuctionById(id));

        case 3:
          auction = _context2.sent;
          return _context2.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(auction)
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var handler = (0, _commonMiddleware["default"])(getAuction);
exports.handler = handler;