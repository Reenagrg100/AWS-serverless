import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
	const result = await dynamoDb.update(params).promise();
	return result;
}
