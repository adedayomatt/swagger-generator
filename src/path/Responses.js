class Responses {
    build() {
        return {
            "200": {
                "description": "OK"
            },
            "400": {
                "description": "Bad Request"
            },
            "404": {
                "description": "The resource was not found"
            },
            "default": {
                "description": "An error occurred"
            }
        }
    }
}

module.exports = Responses;