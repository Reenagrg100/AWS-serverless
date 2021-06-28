import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";
import validator from "@middy/validator";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
	// event: provides info about the request
	// context:- provides info about the metadata of lambda execution

	try {
		const { title } = event.body; //no need to parse this body explictly as we are using middleware
		const now = new Date();
		const endDate = new Date();
		// endDate.setHours(now.getHours() + 1); //close the auction 1 hr after it gets created

		// TODO: keeping same time for now
		endDate.setHours(now.getHours()); //close the auction 1 hr after it gets created

		const auction = {
			id: uuid(),
			title,
			createdAt: now.toISOString(),
			status: "OPEN",
			highestBid: {
				amount: 0,
			},
			endingAt: endDate.toISOString(),
		};

		// saving to dynamo db, ( if this lambda doesn't have permission of DDB, then will throw 502 error means AccessDeniedException )
		await dynamoDb
			.put({
				TableName: process.env.AUCTIONS_TABLE,
				Item: auction,
			})
			.promise();

		console.info("Auction created successfully...");
		return {
			statusCode: 200,
			body: JSON.stringify(auction),
		};
	} catch (error) {
		console.info("Error:", error);
		throw new createError.InternalServerError(error); //there are serveral other errors also
	}
}

// export const handler = middy(createAuction)
// 	.use(httpJsonBodyParser()) //auto parse stringrified body eveerytime, no need to explicity do this
// 	.use(httpEventNormalizer()) //automatically adjust the API gateway if we don't provide some params, saves from errors
// 	.use(httpErrorHandler()); //

export const handler = commonMiddleware(createAuction).use(
	validator({
		inputSchema: createAuctionSchema, //we can also define outputschema means response schema
		ajvOptions: {
			useDefaults: true,
			strict: false,
		},
	}),
);
