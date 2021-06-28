"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ses = new _awsSdk["default"].SES({
  region: "ap-south-1"
});

function sendMail(event, context) {
  var record, email, subject, body, recipient, params, result;
  return regeneratorRuntime.async(function sendMail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("Record:", event.Records);
          record = event.Records[0];
          email = JSON.parse(record.body);
          subject = email.subject, body = email.body, recipient = email.recipient;
          params = {
            Source: "reenagrg100@gmail.com",
            Destination: {
              ToAddresses: [recipient || "reenagrg100@gmail.com"]
            },
            Message: {
              Body: {
                Text: {
                  Data: body || "Hey I'm Learning AWS serverless..."
                }
              },
              Subject: {
                Data: subject || "Testing Mail"
              }
            }
          };
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(ses.sendEmail(params).promise());

        case 8:
          result = _context.sent;
          console.info("Send mail result:", result);
          return _context.abrupt("return", result);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](5);
          console.log("Error while sending mail", _context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 13]]);
}

var handler = sendMail;
exports.handler = handler;