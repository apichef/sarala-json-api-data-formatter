# sarala-json-api-data-formatter

[![codecov](https://codecov.io/gh/milroyfraser/sarala-json-api-data-formatter/branch/master/graph/badge.svg)](https://codecov.io/gh/milroyfraser/sarala-json-api-data-formatter) [![npm version](https://badge.fury.io/js/sarala-json-api-data-formatter.svg)](https://www.npmjs.com/package/sarala-json-api-data-formatter) [![apm](https://img.shields.io/apm/l/vim-mode.svg)](https://github.com/milroyfraser/sarala-json-api-data-formatter/blob/master/LICENSE)

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
  "data": {
    "type": "posts",
    "id": "1",
    "attributes": {
      "slug": "voluptates-laborum-non-voluptatem-ducimus-veniam-et",
      "title": "Voluptates laborum non voluptatem ducimus veniam et.",
      "subtitle": "Cumque aut laudantium repudiandae rem repellendus voluptatem. Sunt ipsa eum ea molestias.",
      "body": "Est quod itaque suscipit quidem dolor dolores velit. Nihil voluptas placeat ex consequatur quasi.\n\nEst nulla cupiditate ad beatae rerum veritatis vel. Quia ut doloribus consequatur porro. Eligendi sit et dignissimos qui voluptatem magnam mollitia labore.\n\nLibero saepe praesentium et sed. Exercitationem error rerum sit inventore provident laborum. Fuga pariatur dolor reiciendis. Quibusdam corrupti commodi ut quo non laboriosam quia. Nihil sit iste sit optio voluptas repellendus exercitationem.",
      "published_at": "2018-01-25"
    },
    "links": {
      "self": "https://sarala-demo.app/api/posts/1"
    },
    "relationships": {
      "tags": {
        "links": {
          "self": "https://sarala-demo.app/api/posts/1/relationships/tags",
          "related": "https://sarala-demo.app/api/posts/1/tags"
        },
        "data": [
          {
            "type": "tags",
            "id": "1"
          },
          {
            "type": "tags",
            "id": "15"
          }
        ]
      }
    }
  },
  "included": [
    {
      "type": "tags",
      "id": "1",
      "attributes": {
        "name": "voluptates"
      },
      "links": {
        "self": "https://sarala-demo.app/api/tags/1"
      }
    },
    {
      "type": "tags",
      "id": "15",
      "attributes": {
        "name": "dolorum"
      },
      "links": {
        "self": "https://sarala-demo.app/api/tags/15"
      }
    }
  ]
};
```

## Simple object data sample

```javascript
const simpleObject = {
  "id": "1",
  "type": "posts",
  "links": {
    "self": "https://sarala-demo.app/api/posts/1"
  },
  "slug": "voluptates-laborum-non-voluptatem-ducimus-veniam-et",
  "title": "Voluptates laborum non voluptatem ducimus veniam et.",
  "subtitle": "Cumque aut laudantium repudiandae rem repellendus voluptatem. Sunt ipsa eum ea molestias.",
  "body": "Est quod itaque suscipit quidem dolor dolores velit. Nihil voluptas placeat ex consequatur quasi.\n\nEst nulla cupiditate ad beatae rerum veritatis vel. Quia ut doloribus consequatur porro. Eligendi sit et dignissimos qui voluptatem magnam mollitia labore.\n\nLibero saepe praesentium et sed. Exercitationem error rerum sit inventore provident laborum. Fuga pariatur dolor reiciendis. Quibusdam corrupti commodi ut quo non laboriosam quia. Nihil sit iste sit optio voluptas repellendus exercitationem.",
  "published_at": "2018-01-25",
  "relationships": [
    "tags"
  ],
  "tags": {
    "links": {
      "self": "https://sarala-demo.app/api/posts/1/relationships/tags",
      "related": "https://sarala-demo.app/api/posts/1/tags"
    },
    "data_collection": true,
    "data": [
      {
        "id": "1",
        "type": "tags",
        "links": {
          "self": "https://sarala-demo.app/api/tags/1"
        },
        "name": "voluptates"
      },
      {
        "id": "15",
        "type": "tags",
        "links": {
          "self": "https://sarala-demo.app/api/tags/15"
        },
        "name": "dolorum"
      }
    ]
  }
};
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

> The `serialize` method can be used similarly with `includeOnly` and `filterFields`.


#### Testing

```bash
npm run t

# run test with watch
npm run tw
```

### Code coverage

```bash
npm run cc
```

#### Code Style

```bash
npm run cs
```