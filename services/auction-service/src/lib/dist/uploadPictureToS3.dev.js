"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadPictureToS3 = uploadPictureToS3;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var s3 = new _awsSdk["default"].S3();

function uploadPictureToS3(key, body) {
  var result;
  return regeneratorRuntime.async(function uploadPictureToS3$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(s3.upload({
            Bucket: process.env.AUCTIONS_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentEncoding: "base64",
            ContentType: "image/jpeg"
          }).promise());

        case 2:
          result = _context.sent;
          console.log("S3 res::::", result);
          return _context.abrupt("return", result);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}