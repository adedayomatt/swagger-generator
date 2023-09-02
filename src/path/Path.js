const $ = require('@adedayomatthews/utility');
const SwaggerPathResponses = require("./Responses");
const SwaggerDefinition = require('../definition/Definition');
const SwaggerSchema = require('../utils/Schema');

class Path {
    tenant = {
        name: "",
        slug: "",
        base_url: "",
    }
    name = "";
    verb = "GET";
    tags = [];
    summary = null;
    description = null;
    externalDocs = null;
    operationId = null;
    produces = ["application/json"];
    consumes = ["application/json"];
    schema = new SwaggerSchema();
    responses = new SwaggerPathResponses();

    setEndpoint( endpoint = {}) {
        return $._set(this, {
            ...endpoint,
            externalDocs: {
                url: "",
                description: ""
            }
        });
    }

    setTenant({
        name = "",
        slug = "",
        base_url = "",
    }) {
        return $._set(this, { tenant: { name, slug, base_url }, tags: [name] } )
    }

    getVerb() {
        return $._get(this,"verb");
    }

    setPayload(payload = {}) {
        return $._set(this, { payload });
    }

    setSchema(schema = new SwaggerSchema()) {
        return $._set(this, { schema });
    }

    getParameter(name, section, definition = new SwaggerDefinition() ) {
        const type = definition.getType();
        let parameter =  {
            "name": name,
            "in": section === "payload" ? "body" : section ,
            "description": definition.getAttribute("description") || $._capitalizeFirstLetter(`${name} in ${section} for ${this.name} request for ${this.tenant.name}`),
            "required": type === "object" ? definition.getRequiredKeys().length >= 1 : definition.isRequired(),
        };
        if(type !== "object") {
            parameter["example"] = definition.getAttribute("example")
        }
        if(section !== "payload") {
            parameter["type"] = type
        }
        if(section === "payload" && type === "object") {
            parameter["schema"] = definition
                .setRef(SwaggerDefinition.getGeneratedRef([this.tenant.name, this.name, "request", section, name]))
                .build()
        } else {
            Object.assign(parameter, definition.additionalProperties())
        }

        return parameter;
    }

    getAllParameters() {
        const schema = this.schema.getSchema();
        const parameters = [];
        $._get(this.schema, "sections", [])
            .forEach(section => {
            const sectionSchema = schema[section] || {};
            for(let key in sectionSchema) {
                parameters.push(this.getParameter(key, section, (new SwaggerDefinition())
                    .setContent(sectionSchema[key])))
            }
        })
        return parameters;
    }

    getRequestBody() {
        const parameters = this.getAllParameters();
        const body = parameters.find(param => param.name === "body");
        if(body) {
            return {
                "content": {
                    "application/json": {
                        description: body.description,
                        required: body.required,
                        schema: body.schema
                    }
                }
            }
        }
        return {};
    }

    build() {
        const path = {};
        path[this.getVerb().toLowerCase()] = {
            "tags": $._get(this, "tags"),
            "summary": $._get(this, "summary") || $._get(this, "name"),
            "description": $._get(this, "description"),
            "produces": $._get(this, "produces"),
            "consumes": $._get(this, "consumes"),
            "externalDocs": $._get(this, "externalDocs"),
            "operationId": $._get(this, "operationId"),
            "requestBody": this.getRequestBody(),
            "parameters": this.getAllParameters().filter(param => param.name !== "body"),
            "responses": $._get(this, "responses").build()
        }
        return path;
    }
}

module.exports = Path;