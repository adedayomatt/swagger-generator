module.exports = class SwaggerInfoLicence {
    name = "MIT";
    url = "https://opensource.org/licenses/MIT";

    build() {
        return {
            "name": this.name,
            "url": this.url,
        }
    }
}
