import Formatter from './../src/Formatter'

import {
    Post as ApiPost,
    PostWithAllNesterRelations as ApiPostWithAllNesterRelations,
    PaginatedPostsList as ApiPaginatedPostsList
} from './data/json-api-responce'

import {
    Post as SimplePost,
    PostWithAllNesterRelations as SimplePostWithAllNesterRelations,
    PaginatedPostsList as SimplePaginatedPostsList
} from './data/simple-object'

let formatter = null

beforeEach(() => {
    formatter = new Formatter()
})

test('it serialize single object', () => {
    const result = formatter.serialize(SimplePost)
    expect(result).toEqual(ApiPost)
})

test('it serialize single object with relationships', () => {
    const result = formatter.serialize(SimplePostWithAllNesterRelations)
    expect(result.data).toEqual(ApiPostWithAllNesterRelations.data)
    expect(result.included.length).toEqual(ApiPostWithAllNesterRelations.included.length)
})

test('it serialize collection of objects', () => {
    const result = formatter.serialize(SimplePaginatedPostsList)
    expect(result).toEqual(ApiPaginatedPostsList)
})
