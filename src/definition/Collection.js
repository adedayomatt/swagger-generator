const $ = require('utility');
const SwaggerDefinition = require('./Definition');
const SwaggerSchema = require('../utils/Schema');

class Collection {
    name = "";
    registry = {};
    endpoints = [];
    collections = [];

    /**
     * Add multiple instances of definition collection to build with this one
     *
     * @param collections
     * @returns {Collection}
     */
    addCollections(collections = []) {
        this.collections = this.collections.concat(collections)
        return this;
    }

    /**
     * Build all accumulated instances of definition collection
     *
     * @returns {{}}
     */
    buildCollections() {
        const definitions = {};
        this.collections.forEach(collection => {
            if(collection instanceof Collection) {
                Object.assign(definitions, collection.build())
            }
        })
        return definitions;
    }

    /**
     * Build this collection with the accumulated collections
     *
     * @returns {{}}
     */
    build() {
        const definitions = {};
        this.endpoints.forEach(endpoint => {
            const schema = new SwaggerSchema()
                .setContentTypes(["application/json"])
                .setRegistry(this.registry)
                .setPayload(endpoint);

            const requestSchema = schema.getSchema();
            $._get(schema, "sections", [])
            .filter(section => ["payload"].includes(section) )
            .forEach(section => {
                const sectionSchema = requestSchema[section] || {};
                for(let key in sectionSchema) {
                    const definition = (new SwaggerDefinition())
                        .setContent(sectionSchema[key]);
                    if(definition.type === "object") {
                        const ref = SwaggerDefinition.getGeneratedRef([this.name, endpoint.name, "request", section, key])
                        definitions[ref] =  definition.build();
                    }
                }
            })
        });
        return { ...definitions, ...this.buildCollections() };
    }
}

module.exports = Collection;