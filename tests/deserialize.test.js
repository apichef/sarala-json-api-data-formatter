import Formatter from './../src/Formatter'
import { clone } from './util'

import {
    Post as ApiPost,
    PostWithRelationalLinks as ApiPostWithRelationalLinks,
    PostWithAllNesterRelations as ApiPostWithAllNesterRelations,
    PostWithAllEmptyNesterRelations as ApiPostWithAllEmptyNesterRelations,
    PostWithAuthor as ApiPostWithAuthor,
    PaginatedPostsList as ApiPaginatedPostsList
} from './data/json-api-responce'

import {
    Post as SimplePost,
    PostWithRelationalLinks as SimplePostWithRelationalLinks,
    PostWithAllNesterRelations as SimplePostWithAllNesterRelations,
    PostWithAllEmptyNesterRelations as SimplePostWithAllEmptyNesterRelations,
    PostWithAuthor as SimplePostWithAuthor,
    PaginatedPostsList as SimplePaginatedPostsList
} from './data/simple-object'

let formatter = null

beforeEach(() => {
    formatter = new Formatter()
})

test('it deserialize single object', () => {
    const result = formatter.deserialize(clone(ApiPost))
    expect(result).toEqual(SimplePost)
})

test('it deserialize related resource object when the data is not present', () => {
    const result = formatter.deserialize(clone(ApiPostWithRelationalLinks))
    expect(result).toEqual(SimplePostWithRelationalLinks)
})

test('it deserialize single object with relationships', () => {
    const result = formatter.deserialize(clone(ApiPostWithAllNesterRelations))
    expect(result).toEqual(SimplePostWithAllNesterRelations)
})

test('it deserialize single object with empty relationships', () => {
    const result = formatter.deserialize(clone(ApiPostWithAllEmptyNesterRelations))
    expect(result).toEqual(SimplePostWithAllEmptyNesterRelations)
})

test('it can specify relations', () => {
    const result = formatter.includeOnly(['author']).deserialize(clone(ApiPostWithAuthor))
    expect(result).toEqual(SimplePostWithAuthor)
})

test('it deserialize collection of objects', () => {
    const result = formatter.deserialize(clone(ApiPaginatedPostsList))
    expect(result).toEqual(SimplePaginatedPostsList)
})
