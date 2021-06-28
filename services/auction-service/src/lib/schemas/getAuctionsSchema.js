//used to define your lambda request schema

const schema = {
	properties: {
		queryStringParameters: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["OPEN", "CLOSED"], //if any value outside this array receives in the status then simply throws 400 error
					default: "OPEN", //means if status is not defined then use this default value
				},
			},
		},
	},
	required: ["queryStringParameters"],
};
export default schema;
