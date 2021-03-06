import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";


//import required modules from:
// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html

export class Cdk1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create Dynamodb table
    const table = new dynamodb.Table(this, 'serverlessExcercise', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });

    //create lambda function
    const dynamoLambdaFn = new lambda.Function(this, 'dynamoHandlerFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'lambda-handler.handler',
      code: lambda.Code.fromAsset('lambda-handler'), //dir where func lives
      //Below saves table name on Lambda's env variables
      environment: {
        TABLE_NAME: table.tableName,
      },

    });

    //allow lambda to write to dynamo
    //https://cdkworkshop.com/20-typescript/40-hit-counter/600-permissions.html
    table.grantReadWriteData(dynamoLambdaFn);

    //create API GW
    const api = new apigateway.RestApi(this, 'products-api');



    api.root
    .resourceForPath('products')
    .addMethod("GET", new apigateway.LambdaIntegration(dynamoLambdaFn))

    // api.root
    // .resourceForPath('product')
    // .addMethod("GET", new apigateway.LambdaIntegration(dynamoLambdaFn))

    const requestValidator = new apigateway.RequestValidator(this, "MyPayloadValidator", {
            restApi: api,
            // requestValidatorName: `myproj-prod-payload-validator`,
            validateRequestBody: true,
            validateRequestParameters: false,
        });

    api.root
    .resourceForPath('products')
    .addMethod("POST", new apigateway.LambdaIntegration(dynamoLambdaFn), {
      requestValidator: requestValidator,
      requestModels: {"application/json": new apigateway.Model(this, "modelFromCDK", {
        restApi: api,
        schema:  {
          "title": "Product",
          "properties": {
            "price": {
              "description": "Price of the product",
              "type": apigateway.JsonSchemaType.NUMBER,
              "minimum": 0
            },
            "name": {
              "description": "name of the product",
              "type": apigateway.JsonSchemaType.STRING,
              "maxLength": 40
            },
            "tags": {
              "description": "Tags for the product",
              "type": apigateway.JsonSchemaType.ARRAY,
              "items": {
                "type": apigateway.JsonSchemaType.STRING,
                "minLength": 1
              },
              "minItems": 0,
              "uniqueItems": true
            }
          },
          "required": [ "id", "price", "name"]
        }
      }) }

    })

    api.root
    .resourceForPath('search')
    .addMethod("POST", new apigateway.LambdaIntegration(dynamoLambdaFn))



    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something failed"
    });

  }
}
