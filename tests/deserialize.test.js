import Formatter from './../src/Formatter';

import {
    Post as ApiPost,
    PostWithAllNesterRelations as ApiPostWithAllNesterRelations,
    PaginatedPostsList as ApiPaginatedPostsList
} from './data/json-api-responce';

import {
    Post as SimplePost,
    PostWithAllNesterRelations as SimplePostWithAllNesterRelations,
    PaginatedPostsList as SimplePaginatedPostsList
} from './data/simple-object';

let formatter = null;

beforeEach(() => {
    formatter = new Formatter();
});

test('it deserialize single object', () => {
    const result = formatter.deserialize(ApiPost);
    expect(result).toEqual(SimplePost);
});

test('it deserialize single object with relationships', () => {
    const result = formatter.deserialize(ApiPostWithAllNesterRelations);
    expect(result).toEqual(SimplePostWithAllNesterRelations);
});

test('it deserialize collection of objects', () => {
    const result = formatter.deserialize(ApiPaginatedPostsList);
    expect(result).toEqual(SimplePaginatedPostsList);
});