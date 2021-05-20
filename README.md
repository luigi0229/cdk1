# Serverless REST API Application using AWS CDK, API Gateway, Lambda and DynamoDB

This is a simple REST API application that handles GET and POST requests to
insert and query a DynamoDB table. It uses a CDK Stack to deploy the
API Gateway with the required routes, the Lambda function using Node runtime,
and the DynamoDB table.

The entire application is contained within the `app.rb` file.

`config.ru` is a minimal Rack configuration for unicorn.

`run-tests.sh` runs a simplistic test and generates the API
documentation below.

It uses `run-curl-tests.rb` which runs each command defined in
`commands.yml`.

## prerequisites

  * AWS CDK environment configured and initialized with required credentials
  * AWSCloudFormationFullAccess role attached to corresponding user

## Deployment

    cdk deploy

# REST API

The REST API examples are below:

## Create a new Object

### Request

`GET /products`

    curl --location --request POST 'API_URL/products' \--header 'Content-Type: application/json' \--data-raw '{"name": "foo","id": "2","price": 5,"tags":["tag1","tag2","tag3"]}'
