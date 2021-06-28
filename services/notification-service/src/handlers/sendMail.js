import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "ap-south-1" });

async function sendMail(event, context) {
	console.log("Record:", event.Records);
	const record = event.Records[0];
	const email = JSON.parse(record.body);

	const { subject, body, recipient } = email;

	const params = {
		Source: "reenagrg100@gmail.com",
		Destination: {
			ToAddresses: [recipient || "reenagrg100@gmail.com"],
		},
		Message: {
			Body: {
				Text: {
					Data: body || "Hey I'm Learning AWS serverless...",
				},
			},
			Subject: {
				Data: subject || "Testing Mail",
			},
		},
	};

	try {
		const result = await ses.sendEmail(params).promise();
		console.info("Send mail result:", result);
		return result;
	} catch (err) {
		console.log("Error while sending mail", err);
	}
}

export const handler = sendMail;
