"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeAuctions = closeAuctions;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamoDb = new _awsSdk["default"].DynamoDB.DocumentClient();
var sqs = new _awsSdk["default"].SQS();

function closeAuctions(auction) {
  var params, title, seller, highestBid, amount, bidder, notifySeller, notifyBidder;
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
          console.log("Close auction. Db updated successfully.");
          title = auction.title, seller = auction.seller, highestBid = auction.highestBid;
          amount = highestBid.amount, bidder = highestBid.bidder; // Notify the seller through SQS message

          _context.next = 8;
          return regeneratorRuntime.awrap(sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
              subject: " Your item has been sold!",
              recipient: seller,
              body: "Wohhoo! Your item ".concat(title, " has been sold for ").concat(amount, ".. ")
            })
          }).promise());

        case 8:
          notifySeller = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
              subject: " You won an auction!",
              recipient: bidder,
              body: "Wohhoo! You got the item ".concat(title, " for ").concat(amount, ".. ")
            })
          }).promise());

        case 11:
          notifyBidder = _context.sent;
          return _context.abrupt("return", Promise.all([notifySeller, notifyBidder]));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}