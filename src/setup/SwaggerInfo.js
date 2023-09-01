const SwaggerInfoLicence = require('./SwaggerInfoLicence');
const SwaggerContact = require('./SwaggerContact');
const SwaggerExternalDoc = require('./SwaggerExternalDocs');

module.exports = class SwaggerInfo {
    version = "1.0";
    title = "Swagger";
    description = "";
    termsOfService = "";
    licence = new SwaggerInfoLicence();
    contact = new SwaggerContact();

    build() {
        return {
            "version": this.version,
            "title": this.title,
            "description": this.description,
            "termsOfService": this.termsOfService,
            "licence": this.licence.build(),
            "contact": this.contact.build(),
        }
    }
}
