import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getAuctionById } from "./getAuction";
import placeBidSchema from "../lib/schemas/placeBidSchema";
import validator from "@middy/validator";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
	const { id } = event.pathParameters;
	const { amount } = event.body;

	const params = {
		TableName: process.env.AUCTIONS_TABLE,
		Key: { id },
		UpdateExpression: "set highestBid.amount=:amount",
		ExpressionAttributeValues: {
			":amount": amount,
		},
		ReturnValues: "ALL_NEW",
	};

	const auction = await getAuctionById(id);

	if (amount <= auction.highestBid.amount) {
		throw new createError.Forbidden(
			`Your bid amount must be higher than ${auction.highestBid.amount}...`,
		);
	}

	if (auction.status === "CLOSED") {
		throw new createError.Forbidden(`You cannot bid on closed auctions...`);
	}

	try {
		const result = await dynamoDb.update(params).promise();
		const updatedAuction = result.Attributes;
		console.log("Update result:", updatedAuction);
		return {
			statusCode: 200,
			body: JSON.stringify(updatedAuction),
		};
	} catch (error) {
		console.info("Error:", error);
		throw new createError.InternalServerError(error); //there are serveral other errors also
	}
}

export const handler = commonMiddleware(placeBid).use(
	validator({
		inputSchema: placeBidSchema,
		ajvOptions: {
			useDefaults: true,
			strict: false,
		},
	}),
);
