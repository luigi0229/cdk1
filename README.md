# Serverless REST API Application using AWS CDK, API Gateway, Lambda and DynamoDB

This is a simple REST API application that handles GET and POST requests to
insert and query a DynamoDB table. It uses a CDK Stack to deploy the
API Gateway with the required routes, a Lambda function using Node runtime,
and the DynamoDB table.

## prerequisites

  * AWS CDK environment configured and initialized with required credentials
  * AWSCloudFormationFullAccess role attached to corresponding user

## Deployment

    cdk deploy

    It returns the API URL

# REST API

The REST API examples are below:

## Create a new product

Creates a new product by passing the required parameters in
compliance with the validation schema.


### Request

`POST /products`

    curl --location --request POST 'API_URL/products' \--header 'Content-Type: application/json' \--data-raw '{"name": "foo","id": "2","price": 5,"tags":["tag1","tag2","tag3"]}'


## Retrieve an product

Retrieves a product by passing it's productId.

### Request

`GET /products`

    curl --location --request GET 'API_URL/products?productId=123' \ --data-raw ''


## Search for products with matching tags

Retrieves all products containing matching tags.

### Request

`POST /search`

    curl --location --request POST 'API_URL/search?tags=mango' \--data-raw ''
