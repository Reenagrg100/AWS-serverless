import createError from "http-errors";
import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { setAuctionPictureUrl } from "../lib/setAuctionPictureUrl";

async function uploadAuctionPicture(event, context) {
	const { id } = event.pathParameters;

	try {
		console.log("Upload auction picture...");
		const auction = await getAuctionById(id);
		console.log("Auction:", auction);
		const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(event.body, "base64");
		console.log("Buffer::", buffer);

		const s3Result = await uploadPictureToS3(auction.id + ".jpeg", buffer);
		const { Location: pictureUrl } = s3Result;

		const updatedAuction = await setAuctionPictureUrl(id, pictureUrl);
		console.log("Updated auction:", updatedAuction);

		return {
			statusCode: 200,
			body: JSON.stringify(updatedAuction),
		};
	} catch (error) {
		console.log("Error:", error);
		throw new createError.InternalServerError(error);
	}
}

export const handler = uploadAuctionPicture;
