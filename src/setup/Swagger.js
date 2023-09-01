const SwaggerInfo = require('./SwaggerInfo');
const SwaggerExternalDocs = require('./SwaggerExternalDocs');
const SwaggerPathCollection = require('../path/Collection');
const SwaggerDefinitionCollection = require('../definition/Collection');
const SwaggerComponents = require('../definition/Components');

module.exports = class Swagger{
    openapi = "3.0.3";
    info = new SwaggerInfo();
    servers = [];
    tags = [];
    paths = new SwaggerPathCollection();
    definitions = new SwaggerDefinitionCollection();
    externalDocs = new SwaggerExternalDocs();

    build() {
        return {
            "openapi": this.openapi,
            "info": this.info.build(),
            "servers": this.servers,
            "tags": this.tags,
            "paths": this.paths.build(),
            "components": { schemas: this.definitions.build() },
            "externalDocs": this.externalDocs.build(),
        }
    }
}
