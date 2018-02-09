# sarala-json-api-data-formatter
> A fluent, framework-agnostic, JavaScript library, that can be used simply, to transform standard JSON API responses to simple JSON objects and vice versa.

## Install

```sh
$ npm i sarala-json-api-data-formatter --save
```

```sh
$ yarn add sarala-json-api-data-formatter
```

## JSON-API response data sample

```javascript
const data = {
   "data": [
     {
       "type": "posts",
       "id": "1",
       "attributes": {
         "slug": "sarala-json-api-data-formatter",
         "title": "Sarala json-api data formatter",
         "subtitle": "A fluent, framework-agnostic, JavaScript library, that can be used simply, to transform standard JSON API responses to simple JSON objects and vice versa.",
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

## Simple object data sample

```javascript
const simpleObject = [
  {
    "id": "1",
    "type": "posts",
    "slug": "sarala-json-api-data-formatter",
    "title": "Sarala json-api data formatter",
    "subtitle": "A fluent, framework-agnostic, JavaScript library, that can be used simply, to transform standard JSON API responses to simple JSON objects and vice versa.",
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
import { Formatter } from "sarala-json-api-data-formatter";

const formatter = new Formatter();

let data = this.deserialize(data);
```

## Serialize

```javascript
import { Formatter } from "sarala-json-api-data-formatter";

const formatter = new Formatter();

let data = this.serialize(data);
```

## Filter relationships

#### Deserialize only root objects and skip all relationships

```javascript
let data = this.includeOnly([]).deserialize(data);
```

#### Deserialize only specific relationships

When post has tags and comments, following will deserialize only root object and comments. Tags will be skipped.

```javascript
let data = this.includeOnly(['comments']).deserialize(data);
```

## Filter fields

#### Deserialize only specified fields

```javascript
let data = this.filterFields({
    posts: ['title', 'subtitle'],
    tags: ['name']
}).deserialize(data);
```

### The `serialize` method can be used similarly with `includeOnly` and `filterFields`.