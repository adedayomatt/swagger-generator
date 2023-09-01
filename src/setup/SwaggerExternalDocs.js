module.exports = class SwaggerExternalDoc {
    url = "";
    description = "";

    build() {
        return {
            "url": this.url,
            "description": this.description,
        }
    }
}
