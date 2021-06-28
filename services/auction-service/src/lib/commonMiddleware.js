import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import middy from "@middy/core";

/**
 * Middlewares have two phases: before and after.
The before phase, happens before the handler is executed. In this code the response is not created yet, so you will have access only to the request.
The after phase, happens after the handler is executed. In this code you will have access to both the request and the response.
Execution of middlewares:-
middleware1 (before)
middleware2 (before)
middleware3 (before)
handler
middleware3 (after)
middleware2 (after)
middleware1 (after)
*/
export default (handler) =>
	middy(handler).use([
		httpJsonBodyParser(), //m1
		httpEventNormalizer(), //m2
		httpErrorHandler(), //m3
	]);
