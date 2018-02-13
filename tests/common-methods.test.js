import Formatter from './../src/Formatter';

let formatter = null;

beforeEach(() => {
    formatter = new Formatter();
});

test('it initialize with clean properties', () => {
    expect(formatter.data).toEqual({});
    expect(formatter.includes).toBeNull();
    expect(formatter.fields).toBeNull();
});

test('includeOnly will set includes to be processed and returns chainable formatter object', () => {
    const includes = ['author', 'tags', 'comments'];
    const chainable = formatter.includeOnly(includes);

    expect(chainable.includes).toEqual(includes);
    expect(chainable).toBeInstanceOf(Formatter);
});

test('filterFields will set fields to be processed and returns chainable formatter object', () => {
    const fields = {
        posts: ['title', 'subtitle'],
        tags: ['name']
    };

    const chainable = formatter.filterFields(fields);

    expect(chainable.fields).toEqual(fields);
    expect(chainable).toBeInstanceOf(Formatter);
});

test('shouldIncludeRelation verifies whether given relationship is in the includes list', () => {
    const includes = ['author', 'tags', 'comments'];
    formatter.includeOnly(includes);

    expect(formatter.shouldIncludeRelation('tags')).toBeTruthy();
    expect(formatter.shouldIncludeRelation('unicorn')).toBeFalsy();
});