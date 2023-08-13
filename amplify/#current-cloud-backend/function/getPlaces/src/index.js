/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };
  try {
    // Query DynamoDB to get data from the "Places" table
    const params = {
      TableName: "dynamo554c1fb2-dev", // Replace with your DynamoDB table name
      FilterExpression: "email = :email",
      ExpressionAttributeNames: {
        "#email": "email", // Replace 'fieldName' with your actual field name
      },
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const result = await dynamoDB.scan(params).promise();
    if (result.Items.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.Items),
      };
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "No items found for the user" }),
      };
    }
  } catch (error) {
    const response = {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error retrieving items", error }),
    };
    return response;
  }
};
