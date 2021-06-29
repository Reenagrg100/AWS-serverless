import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
export async function closeAuctions(auction) {
	const params = {
		TableName: process.env.AUCTIONS_TABLE,
		Key: { id: auction.id },
		UpdateExpression: " set #status = :status ",
		ExpressionAttributeValues: {
			":status": "CLOSED",
		},
		ExpressionAttributeNames: {
			"#status": "status",
		},
	};
	await dynamoDb.update(params).promise();

	console.log("Close auction. Db updated successfully.");

	const { title, seller, highestBid } = auction;
	const { amount, bidder } = highestBid;

	// Notify the seller through SQS message
	const notifySeller = await sqs
		.sendMessage({
			QueueUrl: process.env.MAIL_QUEUE_URL,
			MessageBody: JSON.stringify({
				subject: " Your item has been sold!",
				recipient: seller,
				body: `Wohhoo! Your item ${title} has been sold for ${amount}.. `,
			}),
		})
		.promise();

	// Notify the bidder/purchaser through sqs message
	const notifyBidder = await sqs
		.sendMessage({
			QueueUrl: process.env.MAIL_QUEUE_URL,
			MessageBody: JSON.stringify({
				subject: " You won an auction!",
				recipient: bidder,
				body: `Wohhoo! You got the item ${title} for ${amount}.. `,
			}),
		})
		.promise();

	return Promise.all([notifySeller, notifyBidder]);
}
