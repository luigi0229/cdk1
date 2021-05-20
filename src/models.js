//test
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Product",
  "properties": {
    "price": {
      "description": "Price of the product",
      "type": "number",
      "minimum": 0
    },
    "name": {
      "description": "name of the product",
      "type": "string",
      "maxLength": 40
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": [ "id", "price", "name"]
}
