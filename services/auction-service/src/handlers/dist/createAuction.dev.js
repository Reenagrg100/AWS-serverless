"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _uuid = require("uuid");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _createAuctionSchema = _interopRequireDefault(require("../lib/schemas/createAuctionSchema"));

var _validator = _interopRequireDefault(require("@middy/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function createAuction(event, context) {
  var title, now, endDate, auction;
  return regeneratorRuntime.async(function createAuction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          title = event.body.title; //no need to parse this body explictly as we are using middleware

          now = new Date();
          endDate = new Date(); // endDate.setHours(now.getHours() + 1); //close the auction 1 hr after it gets created
          // TODO: keeping same time for now

          endDate.setHours(now.getHours()); //close the auction 1 hr after it gets created

          auction = {
            id: (0, _uuid.v4)(),
            title: title,
            createdAt: now.toISOString(),
            status: "OPEN",
            highestBid: {
              amount: 0
            },
            endingAt: endDate.toISOString(),
            seller: "reenagrg100@gmail.com" //TODO: static for now, can be fetched from authorizer later on

          }; // saving to dynamo db, ( if this lambda doesn't have permission of DDB, then will throw 502 error means AccessDeniedException )

          _context.next = 8;
          return regeneratorRuntime.awrap(dynamoDb.put({
            TableName: process.env.AUCTIONS_TABLE,
            Item: auction
          }).promise());

        case 8:
          console.info("Auction created successfully...");
          return _context.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(auction)
          });

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.info("Error:", _context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
} // export const handler = middy(createAuction)
// 	.use(httpJsonBodyParser()) //auto parse stringrified body eveerytime, no need to explicity do this
// 	.use(httpEventNormalizer()) //automatically adjust the API gateway if we don't provide some params, saves from errors
// 	.use(httpErrorHandler()); //


var handler = (0, _commonMiddleware["default"])(createAuction).use((0, _validator["default"])({
  inputSchema: _createAuctionSchema["default"],
  //we can also define outputschema means response schema
  ajvOptions: {
    useDefaults: true,
    strict: false
  }
}));
exports.handler = handler;