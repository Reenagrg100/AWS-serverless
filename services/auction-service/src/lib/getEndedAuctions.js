import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
	const now = new Date();
	const params = {
		TableName: process.env.AUCTIONS_TABLE,
		IndexName: "statusAndEndDate",
		KeyConditionExpression: "#status = :status AND endingAt <= :now", //#status means status is a reserved keyword for dynamodb
		ExpressionAttributeValues: {
			":status": "OPEN",
			":now": now.toISOString(),
		},
		ExpressionAttributeNames: {
			"#status": "status",
		},
	};
	const result = await dynamoDb.query(params).promise();
	return result.Items;
}
