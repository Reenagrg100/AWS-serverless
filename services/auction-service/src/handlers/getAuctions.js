import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";
import validator from "@middy/validator";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
	const { status } = event.queryStringParameters;
	try {
		const params = {
			TableName: process.env.AUCTIONS_TABLE,
			IndexName: "statusAndEndDate",
			KeyConditionExpression: "#status=:status",
			ExpressionAttributeValues: {
				":status": status,
			},
			ExpressionAttributeNames: {
				"#status": "status",
			},
		};

		// Scan operation (scans the whole table)
		// const result = await dynamoDb
		// 	.scan({
		// 		TableName: process.env.AUCTIONS_TABLE,
		// 	})
		// 	.promise();

		const result = await dynamoDb.query(params).promise();

		const auctions = result.Items;
		console.log("Scan result:", auctions);
		return {
			statusCode: 200,
			body: JSON.stringify(auctions),
		};
	} catch (error) {
		console.info("Error:", error);
		throw new createError.InternalServerError(error); //there are serveral other errors also
	}
}

export const handler = commonMiddleware(getAuctions).use(
	validator({
		inputSchema: getAuctionsSchema,
		ajvOptions: {
			useDefaults: true,
			strict: false,
		},
	}),
);
