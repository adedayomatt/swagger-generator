const $ = require('@adedayomatthews/utility');
const SwaggerPathCollection = require('../path/Collection');
const SwaggerDefinitionCollection = require("../definition/Collection");

class SwaggerTenant {
    name = "";
    slug = "";
    base_url = "";
    registry = {};
    endpoints = [];

    constructor({
        name = "",
        slug = "",
        base_url = "",
        registry = "{}",
        endpoints = []
    }) {
        $._set(this, { 
            name, slug, base_url, endpoints, 
            registry: registry ? JSON.parse(registry) : {} })
    }

    /**
     * Get path collection for the tenant
     *
     * @returns {SwaggerPathCollection}
     */
    pathCollection() {
        const collection = new SwaggerPathCollection()
        return $._set(collection, {
            prefix: $._get(this, "slug") || $._get(this, "name"),
            ...$._getMany(this, [ "name", "base_url", "registry", "endpoints" ])
        });
    }

    /**
     * Get definition collection for the tenant
     *
     * @returns {SwaggerDefinitionCollection}
     */
    definitionCollection() {
        const collection = new SwaggerDefinitionCollection()
        return $._set(collection, $._getMany(this, [ "name", "registry", "endpoints" ]) );
    }
}

module.exports = SwaggerTenant;