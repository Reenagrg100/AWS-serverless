import createError from "http-errors";
import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuctions } from "../lib/closeAuctions";

async function processAuctions(event, context) {
	console.info("Processing auctions..");
	try {
		const auctionsToClose = await getEndedAuctions();
		console.info("Auctions to close:", auctionsToClose);

		const closePromises = auctionsToClose.map((auction) =>
			closeAuctions(auction),
		);
		console.log("Both seller and bidder are notified through an email...");
		await Promise.all(closePromises);
		return { closed: closePromises.length };
	} catch (error) {
		throw new createError.InternalServerError(error);
	}
}

export const handler = processAuctions;
