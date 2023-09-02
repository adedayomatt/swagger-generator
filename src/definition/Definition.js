const $ = require('@adedayomatthews/utility');
const Placeholder = require('../utils/Placeholder');

class Definition{
    type = "string"
    attributePrefix = "__";
    attributes = {};
    child = null;
    content = {};
    ref = null;

    /**
     * Generate a reference for a definition
     *
     * @param components
     * @returns {string}
     */
    static getGeneratedRef(components = []) {
        return components
            .map(component => $._capitalizeFirstLetter(component).replace(/[\s-_]/g, ""))
            .join("")
    }

    /**
     * Set the raw content to be defined
     *
     * @param content
     * @returns {Definition}
     */
    setContent(content = {}) {
        this.content = content;
        Object.keys(content).forEach(key => {
            if(key.startsWith(this.attributePrefix)) {
                this.attributes[key.replace(this.attributePrefix,"")] = content[key]
            } else {
                this.child = $._isObject(this.child) ? this.child : {};
                this.child[key] = content[key]
            }
        })
        return this.setType(this.getAttribute("type") || (this.child ? $._getDataType(this.child) : "string") )
    }

    /**
     * Get the definition type
     *
     * @returns {string}
     */
    getType() {
        return $._get(this, "type");
    }

    /**
     * Set the definition type
     *
     * @param type
     * @returns {Definition}
     */
    setType(type = "") {
        return $._set(this, { type });
    }

    /**
     * Set definition reference if it is a child of another definition
     *
     * @param ref
     * @returns {Definition}
     */
    setRef(ref = null) {
        return $._set(this, { ref })
    }

    /**
     * Get an attribute of the definition e.g location,rules,description
     *
     * @param {string} attribute
     * @returns {*}
     */
    getAttribute(attribute = "") {
        return this.attributes[attribute];
    }

    /**
     * Get properties of this definition if it has sub definition
     *
     * @returns {{}|null}
     */
    getProperties() {
        if(!this.child) return null;
        const properties = {};
        for(let key in this.child){
            const definition = (new Definition()).setContent(this.content[key]);
            properties[key] = definition.build()
        }
        return properties;
    }

    /**
     * Extract items from attribute that are enclosed with bracket like []
     * @param {string} attribute
     * @returns {RegExpMatchArray|*[]}
     */
    extractItemsFromAttribute(attribute) {
        return (this.getAttribute(attribute) || "[]")
            .match(/\w+/g) || [];
    }

    /**
     * Check if the required validation is set
     *
     * @returns {boolean}
     */
    isRequired() {
       return $._getObjectItem(this.getAttribute("validations") || {}, "required", false)
    }

    /**
     * Get all the required keys by checking for sub definitions that are required
     *
     * @returns {string[]|*[]}
     */
    getRequiredKeys() {
        if(this.child){
            return Object.keys(this.child)
                .filter(key => new Definition().setContent(this.child[key]).isRequired())
        }
        return [];
    }

    /**
     * Get the array items definition for a definition of type array
     *
     * @returns {{type}|{$ref: string}|{type: string, required: boolean, example: *}}
     */
    getArrayItems() {
        const options = this.getAttribute("items") || {}
        const item = {
            "type": options.type || "string",
        }
        const keys = options.keys
        if(options.type === "object" && keys.length){
            item["required"] = keys;
            keys.forEach(key => {
                const definition = $._set(new Definition(), {
                    attributes: {
                        "validations": { required: 1 }
                    }
                })
                $._setObjectItem(item, `properties.${key}`, definition.build())
            })
        }
        return item;
    }


    /**
     * Additional properties
     *
     * @returns {*}
     */
    additionalProperties() {
        const validations = this.getAttribute("validations") || {}
        const properties = {};
         [
           "format", "maximum", "exclusiveMaximum", "minimum", "exclusiveMinimum",  "maxLength",
            "minLength", "pattern", "maxItems", "minItems", "uniqueItems", "enum", "multipleOf"
         ].forEach(property => {
            if(validations[property]) {
                properties[property] = validations[property]
            }
        })
        return properties;
    }

    /**
     * Build this definition
     *
     * @returns {{}}
     */
    build() {
        if(this.ref) {
            return {
                "$ref": `#/components/schemas/${this.ref}`
            }
        }
        const definition = {
            "type": this.getType(),
            "required": this.isRequired(),
        };

        if(definition.type !== "object") {
            definition["example"] = this.getAttribute("example")
        }

        if(definition.type === "object") {
            definition["properties"] = this.getProperties()
            definition["required"] = this.getRequiredKeys()
        }

        if(definition.type === "array") {
            definition["items"] = this.getArrayItems();
        }

        return {...definition, ...this.additionalProperties()};
    }
}

module.exports = Definition;