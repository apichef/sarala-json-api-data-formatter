import {
    each,
    find,
    forEach,
    forOwn,
    indexOf,
    isEmpty,
    isUndefined,
    isArray,
    map
} from 'lodash'

export default class Formatter {
    constructor () {
        this.data = {}
        this.includes = null
        this.fields = null
        this.includedData = []
    }

    includeOnly (includes = []) {
        this.includes = includes

        return this
    }

    filterFields (fields = {}) {
        this.fields = fields

        return this
    }

    shouldIncludeRelation (relation) {
        if (this.includes === null) {
            return true
        }

        return indexOf(this.includes, relation) > 0
    }

    shouldIncludeField (relation, field) {
        if (this.fields === null) {
            return true
        }

        if (!Object.prototype.hasOwnProperty.call(this.fields, relation)) {
            return true
        }

        if (indexOf(this.fields[relation], field) !== -1) {
            return true
        }

        return false
    }

    deserialize (data) {
        this.data = data

        if (isArray(data.data)) {
            return this.deserializeCollection(data)
        }

        return this.deserializeOne(data.data)
    }

    deserializeOne (data) {
        const formatted = {}
        formatted.id = data.id
        formatted.type = data.type

        if (data.links) {
            formatted.links = data.links
        }

        if (data.meta) {
            formatted.meta = data.meta
        }

        forOwn(data.attributes, (value, key) => {
            if (this.shouldIncludeField(data.type, key)) {
                formatted[key] = value
            }
        })

        if (data.relationships) {
            formatted.relationships = []

            for (const key in data.relationships) {
                if (this.shouldIncludeRelation(key)) {
                    formatted.relationships.push(key)
                    const relationship = this.mapAndKillProps(data.relationships[key], {}, ['links', 'meta']).to

                    if (isArray(data.relationships[key].data)) {
                        relationship.data_collection = true
                        relationship.data = this.resolveRelationCollection(data.relationships[key].data)
                    } else if (data.relationships[key].data) {
                        relationship.data = this.resolveRelation(data.relationships[key].data)
                    }

                    formatted[key] = relationship
                }
            }
        }

        return formatted
    }

    deserializeCollection (data) {
        data.data_collection = true

        data.data = map(data.data, item => {
            return this.deserializeOne(item)
        })

        return data
    }

    resolveRelation (data) {
        return this.deserializeOne(find(this.data.included, data))
    }

    resolveRelationCollection (relations) {
        return map(relations, relation => {
            return this.resolveRelation(relation)
        })
    }

    mapAndKillProps (from, to, props) {
        each(props, prop => {
            if (Object.prototype.hasOwnProperty.call(from, prop)) {
                to[prop] = from[prop]
                delete from[prop]
            }
        })

        return { from, to }
    }

    isSerializeableCollection (data) {
        return Object.prototype.hasOwnProperty.call(data, 'data_collection') && data.data_collection === true && isArray(data.data)
    }

    serialize (data) {
        this.includedData = []
        let serialized = {}

        if (this.isSerializeableCollection(data)) {
            serialized = this.serializeCollection(data)
        } else {
            serialized.data = this.serializeOne(data)
        }

        if (this.includedData.length) {
            serialized.included = this.includedData
        }

        return serialized
    }

    serializeOne (data) {
        let serialized = {
            attributes: {},
            relationships: {}
        }

        const mapAndKilled = this.mapAndKillProps(data, serialized, ['id', 'type', 'links', 'meta'])

        data = mapAndKilled.from
        serialized = mapAndKilled.to

        if (Object.prototype.hasOwnProperty.call(data, 'relationships')) {
            forEach(data.relationships, relationship => {
                if (this.shouldIncludeRelation(relationship)) {
                    const relationshipData = this.mapAndKillProps(data[relationship], {}, ['links', 'meta']).to

                    if (this.isSerializeableCollection(data[relationship])) {
                        relationshipData.data = this.serializeRelationshipCollection(data[relationship].data)
                    } else {
                        relationshipData.data = this.serializeRelationship(data[relationship].data)
                    }

                    serialized.relationships[relationship] = relationshipData
                }

                delete data[relationship]
            })

            delete data.relationships
        }

        forOwn(data, (value, key) => {
            if (this.shouldIncludeField(serialized.type, key)) {
                serialized.attributes[key] = value
            }
        })

        if (isEmpty(serialized.relationships)) {
            delete serialized.relationships
        }

        return serialized
    }

    serializeCollection (data) {
        const mapAndKilled = this.mapAndKillProps(data, {}, ['links', 'meta'])

        data = mapAndKilled.from
        const serialized = mapAndKilled.to

        serialized.data = map(data.data, item => {
            return this.serializeOne(item)
        })

        return serialized
    }

    serializeRelationship (data) {
        const serialized = this.serializeOne(data)
        this.addToIncludes(serialized)

        return { type: serialized.type, id: serialized.id }
    }

    serializeRelationshipCollection (data) {
        return map(data, item => {
            return this.serializeRelationship(item)
        })
    }

    addToIncludes (data) {
        if (isUndefined(find(this.includedData, { id: data.id, type: data.type }))) {
            this.includedData.push(data)
        }
    }
}
