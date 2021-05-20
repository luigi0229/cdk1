import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

//import required modules from:
// https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html

export class Cdk1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //Create Dynamodb table
    //
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

    api.root
    .resourceForPath('products')
    .addMethod("POST", new apigateway.LambdaIntegration(dynamoLambdaFn))

    api.root
    .resourceForPath('search')
    .addMethod("POST", new apigateway.LambdaIntegration(dynamoLambdaFn))

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong"
    });

  }
}
