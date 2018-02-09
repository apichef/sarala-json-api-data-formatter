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

    includeRelation (relation) {
        if (this.includes === null) {
            return true;
        }

        return _.indexOf(this.includes, relation) > 0;
    }

    includeField (relation, field) {
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
        let thiss = this;
        this.data = data;

        if (_.isArray(data.data)) {
            return _.map(data.data, item => {
                return thiss.deserializeOne(item);;
            });
        }

        return thiss.deserializeOne(data.data);
    }

    deserializeOne (data) {
        let formatted = {};
        formatted.id = data.id;
        formatted.type = data.type;

        let thiss = this;

        _.forOwn(data.attributes, (value, key) => {
            if (thiss.includeField(data.type, key)) {
                formatted[key] = value;
            }
        });

        if (data.relationships) {
            formatted.relationships = [];

            for (var key in data.relationships) {
                if (this.includeRelation(key)) {
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
                if (thiss.includeRelation(relationship)) {
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
            console.log(thiss.includeField(serialized.type, key), serialized.type, key);
            if (thiss.includeField(serialized.type, key)) {
                console.log(serialized.attributes, value, key);
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