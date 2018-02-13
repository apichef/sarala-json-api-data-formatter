import _ from 'lodash';

export default class Formatter {
    constructor () {
        this.data = {};
        this.includes = null;
        this.fields = null;
    }

    includeOnly (includes = []) {
        this.includes = includes;

        return this;
    }

    filterFields (fields = {}) {
        this.fields = fields;

        return this;
    }

    shouldIncludeRelation (relation) {
        if (this.includes === null) {
            return true;
        }

        return _.indexOf(this.includes, relation) > 0;
    }

    shouldIncludeField (relation, field) {
        if (this.fields === null) {
            return true;
        }

        if (! this.fields.hasOwnProperty(relation)) {
            return true;
        }

        if (_.indexOf(this.fields[relation], field) !== -1) {
            return true;
        }

        return false;
    }

    deserialize (data) {
        this.data = data;

        if (_.isArray(data.data)) {
            return this.deserializeCollection(data);
        }

        return this.deserializeOne(data.data);
    }

    deserializeOne (data) {
        let formatted = {};
        formatted.id = data.id;
        formatted.type = data.type;

        if (data.links) {
            formatted.links = data.links;
        }

        if (data.meta) {
            formatted.meta = data.meta;
        }

        let thiss = this;

        _.forOwn(data.attributes, (value, key) => {
            if (thiss.shouldIncludeField(data.type, key)) {
                formatted[key] = value;
            }
        });

        if (data.relationships) {
            formatted.relationships = [];

            for (var key in data.relationships) {
                if (this.shouldIncludeRelation(key)) {
                    formatted.relationships.push(key);

                    if (_.isArray(data.relationships[key].data)) {
                        formatted[key] = this.resolveRelationCollection(data.relationships[key].data);
                    } else {
                        formatted[key] = this.resolveRelation(data.relationships[key].data);
                    }
                }
            }
        }

        return formatted;
    }

    deserializeCollection (data) {
        const thiss = this;
        data.data_collection = true;

        data.data = _.map(data.data, item => {
            return thiss.deserializeOne(item);
        });

        return data;
    }

    resolveRelation (data) {
        return this.deserializeOne(_.find(this.data.included, data));
    }

    resolveRelationCollection (relations) {
        return _.map(relations, relation => {
            return this.resolveRelation(relation);
        });
    }

    serialize (data) {
        if (_.isArray(data)) {
            return this.serializeCollection(data);
        }

        return this.serializeOne(data);
    }

    serializeOne (data) {
        let serialized = {
            attributes: {},
            relationships: {}
        };

        serialized.type = data.type;
        delete data.type;

        if (data.hasOwnProperty('id')) {
            serialized.id = data.id;
            delete data.id;
        }

        let thiss = this;

        if (data.hasOwnProperty('relationships')) {
            _.forEach(data.relationships, relationship => {
                if (thiss.shouldIncludeRelation(relationship)) {
                    if (_.isArray(data[relationship])) {
                        serialized.relationships[relationship] = {
                            data: this.serializeCollection(data[relationship])
                        };
                    } else {
                        serialized.relationships[relationship] = {
                            data: this.serializeOne(data[relationship])
                        };
                    }
                }

                delete data[relationship];
            });

            delete data.relationships;
        }

        _.forOwn(data, (value, key) => {
            if (thiss.shouldIncludeField(serialized.type, key)) {
                serialized.attributes[key] = value;
            }
        });

        if (_.isEmpty(serialized.relationships)) {
            delete serialized.relationships;
        }

        return serialized;
    }

     serializeCollection (data) {
        return _.map(data, item => {
            return this.serializeOne(item);
        });
    }
}