"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

var _getAuction = require("./getAuction");

var _placeBidSchema = _interopRequireDefault(require("../lib/schemas/placeBidSchema"));

var _validator = _interopRequireDefault(require("@middy/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function placeBid(event, context) {
  var id, amount, bidder, params, auction, result, updatedAuction;
  return regeneratorRuntime.async(function placeBid$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = event.pathParameters.id;
          amount = event.body.amount;
          bidder = "reenagrg100@gmail.com"; //TODO: static for now, can be fetched from authorizer later on

          params = {
            TableName: process.env.AUCTIONS_TABLE,
            Key: {
              id: id
            },
            UpdateExpression: "set highestBid.amount =:amount, highestBid.bidder = :bidder",
            ExpressionAttributeValues: {
              ":amount": amount,
              ":bidder": bidder
            },
            ReturnValues: "ALL_NEW"
          };
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _getAuction.getAuctionById)(id));

        case 6:
          auction = _context.sent;

          if (!(amount <= auction.highestBid.amount)) {
            _context.next = 9;
            break;
          }

          throw new _httpErrors["default"].Forbidden("Your bid amount must be higher than ".concat(auction.highestBid.amount, "..."));

        case 9:
          if (!(auction.status === "CLOSED")) {
            _context.next = 11;
            break;
          }

          throw new _httpErrors["default"].Forbidden("You cannot bid on closed auctions...");

        case 11:
          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(dynamoDb.update(params).promise());

        case 14:
          result = _context.sent;
          updatedAuction = result.Attributes;
          console.log("Update result:", updatedAuction);
          return _context.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(updatedAuction)
          });

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](11);
          console.info("Error:", _context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[11, 20]]);
}

var handler = (0, _commonMiddleware["default"])(placeBid).use((0, _validator["default"])({
  inputSchema: _placeBidSchema["default"],
  ajvOptions: {
    useDefaults: true,
    strict: false
  }
}));
exports.handler = handler;