import Formatter from './../src/Formatter'
import { clone } from './util'

import {
    Post as ApiPost,
    PostWithAllNesterRelations as ApiPostWithAllNesterRelations,
    PostWithAllEmptyNesterRelations as ApiPostWithAllEmptyNesterRelations,
    PostWithAuthor as ApiPostWithAuthor,
    PaginatedPostsList as ApiPaginatedPostsList
} from './data/json-api-responce'

import {
    Post as SimplePost,
    PostWithAllNesterRelations as SimplePostWithAllNesterRelations,
    PostWithAllEmptyNesterRelations as SimplePostWithAllEmptyNesterRelations,
    PaginatedPostsList as SimplePaginatedPostsList
} from './data/simple-object'

let formatter = null

beforeEach(() => {
    formatter = new Formatter()
})

test('it serialize single object', () => {
    const result = formatter.serialize(clone(SimplePost))
    expect(result).toEqual(ApiPost)
})

test('it serialize single object with relationships', () => {
    const result = formatter.serialize(clone(SimplePostWithAllNesterRelations))
    expect(result.data).toEqual(ApiPostWithAllNesterRelations.data)
    expect(result.included.length).toEqual(ApiPostWithAllNesterRelations.included.length)
})

test('it serialize single object with empty relationships', () => {
    const result = formatter.serialize(clone(SimplePostWithAllEmptyNesterRelations))
    expect(result.data).toEqual(ApiPostWithAllEmptyNesterRelations.data)
    expect(result.included).toEqual(ApiPostWithAllEmptyNesterRelations.included)
})

test('it can specify relations', () => {
    const result = formatter.includeOnly(['author']).serialize(clone(SimplePostWithAllNesterRelations))
    expect(result.data).toEqual(ApiPostWithAuthor.data)
    expect(result.included).toEqual(ApiPostWithAuthor.included)
})

test('it serialize collection of objects', () => {
    const result = formatter.serialize(clone(SimplePaginatedPostsList))
    expect(result).toEqual(ApiPaginatedPostsList)
})
