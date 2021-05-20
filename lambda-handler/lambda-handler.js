//making a change 2

const AWS = require("aws-sdk");
const dynamodbTableName = process.env.TABLE_NAME;

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event) {
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === '/':
      response = await getProducts();
      break;
    case event.httpMethod === 'POST' && event.path === '/products':
      response = await saveProduct(JSON.parse(event.body));
      break;
    case event.httpMethod === 'POST' && event.path === '/search':
      response = await searchProduct(event.queryStringParameters.tags);
      break;
    case event.httpMethod === 'GET' && event.path === '/products':
      response = await getProduct(event.queryStringParameters.productId);
      break;
    default:
      response = buildResponse(404, '404 Not Found', event.path);
  }
  return response;
}

async function getProducts() {
  const params = {
    TableName: dynamodbTableName
  }
  //scan the dynamodb for all products
  //https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html
  const allProducts = await dynamodb.scan(params).promise();
  const body = {
    _records: allProducts.Items
  }
  return buildResponse(200, body);
}

async function getProduct(productId) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      'id': productId
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    return buildResponse(200, response.Item);
  }, (error) => {
    return buildResponse(501, {"error fetching": error})
  });
}


  //using PUT from documentClient to insert, rather than putItem
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
async function saveProduct(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody
  }

  return await dynamodb.put(params).promise().then(() => {
    const body = {
      id: requestBody.id,
      name: requestBody.name,
      price: requestBody.price,
      tags: requestBody.tags,
    }
    return buildResponse(201, body);
  }, (error) => {
    console.error('Error while inserting item in DB ', error);
  })
}

async function searchProduct(tags) {
  const params = {
    TableName: dynamodbTableName
  }
  var testTags = tags.split(",");

  return await dynamodb.scan(params).promise().then((response) => {
    //Having a hard time with the query function when comparing multiple strings
    //doing a nested loop for now. It's not efficient, but it gets the job done
    //until i can figure out how to query properly
    // return buildResponse(201, {"items": response.Items[0]})
    var filteredItems = []
    var index;
    var innerIndex;
      for (index = 0; index < response.Items.length; ++index) {
          for (innerIndex=0; innerIndex < testTags.length; ++innerIndex) {
            if (response.Items[index].tags.includes(testTags[innerIndex])) {
              filteredItems.push(response.Items[index]);
              break;
            }
          }
      }

    return buildResponse(200, filteredItems);
  }, (error) => {
    return buildResponse(501, {"error fetching": error})
  });
}


function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}
