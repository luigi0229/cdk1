# Serverless REST API Application using AWS CDK, API Gateway, Lambda and DynamoDB

This is a simple REST API application that handles GET and POST requests to
insert and query a DynamoDB table. It uses a CDK Stack to deploy the
API Gateway with the required routes, the Lambda function using Node runtime,
and the DynamoDB table.

## prerequisites

  * AWS CDK environment configured and initialized with required credentials
  * AWSCloudFormationFullAccess role attached to corresponding user

## Deployment

    cdk deploy

# REST API

The REST API examples are below:

## Create a new Object

### Request

`POST /products`

    curl --location --request POST 'API_URL/products' \--header 'Content-Type: application/json' \--data-raw '{"name": "foo","id": "2","price": 5,"tags":["tag1","tag2","tag3"]}'
