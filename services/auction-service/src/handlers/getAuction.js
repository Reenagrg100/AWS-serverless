import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
	console.log("Get auction :", id);
	let auction;
	try {
		// here we are querying based on partition key i.e id
		const result = await dynamoDb
			.get({
				TableName: process.env.AUCTIONS_TABLE,
				Key: { id },
			})
			.promise();
		auction = result.Item;

		console.log("Query result:", auction);
	} catch (error) {
		console.info("Error:", error);
		throw new createError.InternalServerError(error); //there are serveral other errors also
	}

	// if no auction found
	if (!auction) {
		throw new createError.NotFound(`Auction with ${id} not found in table..`); //there are serveral other errors also
	}
	return auction;
}

async function getAuction(event, context) {
	const { id } = event.pathParameters;
	const auction = await getAuctionById(id);
	return {
		statusCode: 200,
		body: JSON.stringify(auction),
	};
}

export const handler = commonMiddleware(getAuction);
