"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _getAuction = require("./getAuction");

var _uploadPictureToS = require("../lib/uploadPictureToS3");

var _setAuctionPictureUrl = require("../lib/setAuctionPictureUrl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function uploadAuctionPicture(event, context) {
  var id, auction, base64, buffer, s3Result, pictureUrl, updatedAuction;
  return regeneratorRuntime.async(function uploadAuctionPicture$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = event.pathParameters.id;
          _context.prev = 1;
          console.log("Upload auction picture...");
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _getAuction.getAuctionById)(id));

        case 5:
          auction = _context.sent;
          console.log("Auction:", auction);
          base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
          buffer = Buffer.from(event.body, "base64");
          console.log("Buffer::", buffer);
          _context.next = 12;
          return regeneratorRuntime.awrap((0, _uploadPictureToS.uploadPictureToS3)(auction.id + ".jpeg", buffer));

        case 12:
          s3Result = _context.sent;
          pictureUrl = s3Result.Location;
          _context.next = 16;
          return regeneratorRuntime.awrap((0, _setAuctionPictureUrl.setAuctionPictureUrl)(id, pictureUrl));

        case 16:
          updatedAuction = _context.sent;
          console.log("Updated auction:", updatedAuction);
          return _context.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(updatedAuction)
          });

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](1);
          console.log("Error:", _context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 21]]);
}

var handler = uploadAuctionPicture;
exports.handler = handler;