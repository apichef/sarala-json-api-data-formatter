# sarala-json-api-data-formatter
> Simple and fluent framework agnostic javascript library to transform standard JSON API responses to simple JSON objects and vice versa.

## Install

```sh
$ npm i sarala-json-api-data-formatter --save
```

```sh
$ yarn add sarala-json-api-data-formatter
```

## JSON-API response data

```javascript
const data = {
   "data": [
     {
       "type": "posts",
       "id": "1",
       "attributes": {
         "slug": "sarala-json-api-data-formatter",
         "title": "Sarala json-api data formatter",
         "subtitle": "Simple and fluent framework agnostic javascript library to transform standard JSON API responses to simple JSON objects and vice versa.",
         "published_at": "2018-01-21"
       },
       "relationships": {
         "tags": {
           "data": [
             {
               "type": "tags",
               "id": "1"
             },
             {
               "type": "tags",
               "id": "2"
             }
           ]
         }
       }
     }
   ],
   "included": [
     {
       "type": "tags",
       "id": "1",
       "attributes": {
         "name": "json-api"
       }
     },
     {
       "type": "tags",
       "id": "2",
       "attributes": {
         "name": "transform"
       }
     }
   ]
 };
```

## Simple object data

```javascript
const simpleObject = [
  {
    "id": "1",
    "type": "posts",
    "slug": "sarala-json-api-data-formatter",
    "title": "Sarala json-api data formatter",
    "subtitle": "Simple and fluent framework agnostic javascript library to transform standard JSON API responses to simple JSON objects and vice versa.",
    "published_at": "2018-01-21",
    "relationships": [
      "tags"
    ],
    "tags": [
      {
        "id": "1",
        "type": "tags",
        "name": "json-api"
      },
      {
        "id": "2",
        "type": "tags",
        "name": "transform"
      }
    ]
  }
];
```

## Deserialize

```javascript
const formatter = new Formatter();

let data = this.deserialize(data);
```

## Serialize

```javascript
const formatter = new Formatter();

let data = this.deserialize(data);
```

## Filter relationships

#### deserialize only root objects and skipp all relationships

```javascript
let data = this.includeOnly([]).deserialize(data);
```

#### deserialize only specific relationships

when post has tags and comments, following will deserialize only root object and comments. tags will be skipped.

```javascript
let data = this.includeOnly(['comments']).deserialize(data);
```

## Filter fields

#### deserialize only specified fields

```javascript
let data = this.filterFields({
    posts: ['title', 'subtitle'],
    tag: ['name']
}).deserialize(data);
```

#### In the same way you can use `includeOnly` and  `filterFields` with `serialize` method.