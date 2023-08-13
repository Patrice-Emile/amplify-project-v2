/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

exports.handler = async (event) => {
  const { email, name, comment, rating } = JSON.parse(event.body);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  };
  const params = {
    TableName: "dynamo554c1fb2-dev", // Replace with your DynamoDB table name
    Item: {
      id: uuid.v4(),
      email,
      name,
      comment,
      rating,
    },
  };
  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Place added successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error),
    };
  }
};
