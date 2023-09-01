const $ = require('utility');
const SwaggerPath = require('./Path');
const SwaggerSchema = require("../utils/Schema");

class Collection {
    name = "";
    prefix = "";
    base_url = "";
    registry = {};
    endpoints = [];
    collections = [];

    /**
     * Add multiple instances of path collection to build with this one
     *
     * @param collections
     * @returns {Collection}
     */
    addCollections(collections = []) {
        this.collections = this.collections.concat(collections)
        return this;
    }

    /**
     * Build all accumulated instances of path collection
     *
     * @returns {{}}
     */
    buildCollections() {
        const paths = {};
        this.collections.forEach(collection => {
            if(collection instanceof Collection) {
                Object.assign(paths, collection.build())
            }
        })
        return paths;
    }

    /**
     * Build this collection with the accumulated collections
     *
     * @returns {{}}
     */
    build() {
        const paths = {};
        this.endpoints.forEach(endpoint => {
            const schema = new SwaggerSchema()
                .setContentTypes(["application/json"])
                .setRegistry(this.registry)
                .setPayload(endpoint)

            paths[schema.getResolvedUrl(this.prefix, endpoint)] = (new SwaggerPath())
                .setTenant({ slug: $._get(this, "prefix"), ...$._getMany(this, ["name", "base_url"])})
                .setSchema(schema)
                .setEndpoint(endpoint)
                .build()
        })
        return { ...paths, ...this.buildCollections() };
    }

}

module.exports = Collection;