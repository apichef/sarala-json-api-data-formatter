import _ from 'lodash'

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

        return _.indexOf(this.includes, relation) > 0
    }

    shouldIncludeField (relation, field) {
        if (this.fields === null) {
            return true
        }

        if (!this.fields.hasOwnProperty(relation)) {
            return true
        }

        if (_.indexOf(this.fields[relation], field) !== -1) {
            return true
        }

        return false
    }

    deserialize (data) {
        this.data = data

        if (_.isArray(data.data)) {
            return this.deserializeCollection(data)
        }

        return this.deserializeOne(data.data)
    }

    deserializeOne (data) {
        let formatted = {}
        formatted.id = data.id
        formatted.type = data.type

        if (data.links) {
            formatted.links = data.links
        }

        if (data.meta) {
            formatted.meta = data.meta
        }

        _.forOwn(data.attributes, (value, key) => {
            if (this.shouldIncludeField(data.type, key)) {
                formatted[key] = value
            }
        })

        if (data.relationships) {
            formatted.relationships = []

            for (var key in data.relationships) {
                if (this.shouldIncludeRelation(key)) {
                    formatted.relationships.push(key)
                    let relationship = this.mapAndKillProps(data.relationships[key], {}, ['links', 'meta']).to

                    if (_.isArray(data.relationships[key].data)) {
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

        data.data = _.map(data.data, item => {
            return this.deserializeOne(item)
        })

        return data
    }

    resolveRelation (data) {
        return this.deserializeOne(_.find(this.data.included, data))
    }

    resolveRelationCollection (relations) {
        return _.map(relations, relation => {
            return this.resolveRelation(relation)
        })
    }

    mapAndKillProps (from, to, props) {
        _.each(props, prop => {
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop]
                delete from[prop]
            }
        })

        return { from, to }
    }

    isSerializeableCollection (data) {
        return data.hasOwnProperty('data_collection') && data.data_collection === true && _.isArray(data.data)
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

        if (data.hasOwnProperty('relationships')) {
            _.forEach(data.relationships, relationship => {
                if (this.shouldIncludeRelation(relationship)) {
                    let relationshipData = this.mapAndKillProps(data[relationship], {}, ['links', 'meta']).to

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

        _.forOwn(data, (value, key) => {
            if (this.shouldIncludeField(serialized.type, key)) {
                serialized.attributes[key] = value
            }
        })

        if (_.isEmpty(serialized.relationships)) {
            delete serialized.relationships
        }

        return serialized
    }

    serializeCollection (data) {
        const mapAndKilled = this.mapAndKillProps(data, {}, ['links', 'meta'])

        data = mapAndKilled.from
        let serialized = mapAndKilled.to

        serialized.data = _.map(data.data, item => {
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
        return _.map(data, item => {
            return this.serializeRelationship(item)
        })
    }

    addToIncludes (data) {
        if (_.isUndefined(_.find(this.includedData, { id: data.id, type: data.type }))) {
            this.includedData.push(data)
        }
    }
}
