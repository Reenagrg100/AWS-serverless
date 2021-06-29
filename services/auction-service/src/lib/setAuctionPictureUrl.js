import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function setAuctionPictureUrl(id, pictureUrl) {
	const now = new Date();
	const params = {
		TableName: process.env.AUCTIONS_TABLE,
		Key: { id },
		UpdateExpression: " set pictureUrl = :pictureUrl",
		ExpressionAttributeValues: {
			":pictureUrl": pictureUrl,
		},
		ReturnValues: "ALL_NEW",
	};
	const result = await dynamoDb.update(params).promise();
	return result;
}
