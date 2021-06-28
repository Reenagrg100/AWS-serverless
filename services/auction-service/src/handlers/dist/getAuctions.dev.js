"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

var _getAuctionsSchema = _interopRequireDefault(require("../lib/schemas/getAuctionsSchema"));

var _validator = _interopRequireDefault(require("@middy/validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();

function getAuctions(event, context) {
  var status, params, result, auctions;
  return regeneratorRuntime.async(function getAuctions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          status = event.queryStringParameters.status;
          _context.prev = 1;
          params = {
            TableName: process.env.AUCTIONS_TABLE,
            IndexName: "statusAndEndDate",
            KeyConditionExpression: "#status=:status",
            ExpressionAttributeValues: {
              ":status": status
            },
            ExpressionAttributeNames: {
              "#status": "status"
            }
          }; // Scan operation (scans the whole table)
          // const result = await dynamoDb
          // 	.scan({
          // 		TableName: process.env.AUCTIONS_TABLE,
          // 	})
          // 	.promise();

          _context.next = 5;
          return regeneratorRuntime.awrap(dynamoDb.query(params).promise());

        case 5:
          result = _context.sent;
          auctions = result.Items;
          console.log("Scan result:", auctions);
          return _context.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(auctions)
          });

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.info("Error:", _context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}

var handler = (0, _commonMiddleware["default"])(getAuctions).use((0, _validator["default"])({
  inputSchema: _getAuctionsSchema["default"],
  ajvOptions: {
    useDefaults: true,
    strict: false
  }
}));
exports.handler = handler;