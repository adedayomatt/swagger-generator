const SwaggerExternalDocs = require("./SwaggerExternalDocs");

module.exports = class SwaggerExternalDoc {
    name = "";
    description = "";
    externalDocs = new SwaggerExternalDocs();

    build() {
        return {
            "name": this.name,
            "description": this.description,
            "externalDocs": this.externalDocs.build()
        }
    }
}
