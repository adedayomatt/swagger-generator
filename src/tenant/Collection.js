const SwaggerTenant = require('./Tenant');
const SwaggerPathCollection = require('../path/Collection');
const SwaggerDefinitionCollection = require('../definition/Collection');

class Collection {
    tenants = [];
    constructor(tenants = []) {
        this.tenants = tenants;
    }

    /**
     * Get path collections for all the tenant
     *
     * @returns {SwaggerPathCollection}
     */
    pathCollection() {
        const pathCollection = new SwaggerPathCollection();
        return pathCollection.addCollections(
            this.tenants.map(tenant => new SwaggerTenant(tenant).pathCollection())
        )
    }

    /**
     * Get definitions collections for all the tenants
     *
     * @returns {SwaggerDefinitionCollection}
     */

    definitionCollection() {
        const definitionCollection = (new SwaggerDefinitionCollection())
        return definitionCollection.addCollections(
            this.tenants.map(tenant => new SwaggerTenant(tenant).definitionCollection())
        )
    }
}

module.exports = Collection;