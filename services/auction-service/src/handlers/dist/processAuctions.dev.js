"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _getEndedAuctions = require("../lib/getEndedAuctions");

var _closeAuctions = require("../lib/closeAuctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function processAuctions(event, context) {
  var auctionsToClose, closePromises;
  return regeneratorRuntime.async(function processAuctions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.info("Processing auctions..");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _getEndedAuctions.getEndedAuctions)());

        case 4:
          auctionsToClose = _context.sent;
          console.info("Auctions to close:", auctionsToClose);
          closePromises = auctionsToClose.map(function (auction) {
            return (0, _closeAuctions.closeAuctions)(auction);
          });
          console.log("Both seller and bidder are notified through an email...");
          _context.next = 10;
          return regeneratorRuntime.awrap(Promise.all(closePromises));

        case 10:
          return _context.abrupt("return", {
            closed: closePromises.length
          });

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
}

var handler = processAuctions;
exports.handler = handler;