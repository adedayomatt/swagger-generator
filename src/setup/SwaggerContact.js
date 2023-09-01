module.exports = class SwaggerContact {
    name
    url
    email

    build() {
        return {
            "name": this.name,
            "url": this.url,
            "email": this.email,
        }
    }
}
