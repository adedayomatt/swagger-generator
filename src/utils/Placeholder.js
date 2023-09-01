const $ = require("utility");
module.exports = class Placeholder {

    format = "{}";
    partSeparator = "|";
    attributeSeparator = "&";
    attributePrefix = "";

    /**
     * Extract all placeholders in a text
     *
     * @param {string} text
     * @param placeholder
     * @returns {*[]}
     */
    extractFrom(text = "") {
        if(this.format.length) {
            const opening = this.format.slice(0, this.format.length/2);
            const closing = this.format.slice(opening.length)
            const pattern = `${opening}([^${opening}${closing}]+)${closing}`;
            return (text.match(new RegExp(pattern, "g")) || []).map(placeholder => {
                return placeholder.match(new RegExp(pattern))[1]
            });
        }
        return []
    }

    /**
     * Resolve a placeholder to an object with its attributes
     *
     * @param {string} placeholder
     * @returns {{}}
     */
    resolve(placeholder = "") {
        const parts = placeholder.split(this.partSeparator);
        const config = { [this.attributePrefix+"id"]: parts[0] };
        if(parts[1]) {
            Object.assign(config, this.getAttributes(parts[1]))
        }
        return config;
    }

    /**
     * Resolve an object placeholder with its attributes
     * 
     * @param placeholder
     * @returns {{[p: string]: *}}
     */
    resolveObject(placeholder = {}) {
        const resolved = { [this.attributePrefix+"id"]: placeholder.source };
        for(let key in placeholder) {
            resolved[this.attributePrefix+key] = placeholder[key]
        }
        return resolved;
    }

    /**
     * convert string of attributes to an object
     *
     * @param {string} attributesString
     * @param {string} objectKeyPrefix
     * @returns {{}}
     */
    getAttributes(attributesString = "") {
        const obj = {};
        const separator = this.attributeSeparator;
        const pattern = `(\\$?\\w+)=(.[^${separator}]+)`;
        (attributesString.match(new RegExp(pattern, "g")) || []).forEach(option => {
            const [property, key, value] = option.match(new RegExp(pattern))
            obj[this.attributePrefix+key] = value;
        })
        return obj;
    }

    /**
     * Get single attribute from string of attributes or resolved attributes object
     *
     * @param {string|Object} attributes
     * @param {string} attribute
     * @returns {string|null}
     */
    getAttribute(attributes, attribute, defaultValue = null) {
        const allAttributes = typeof attributes == "object"
            ? attributes
            : this.getAttributes(attributes);
        return allAttributes[this.attributePrefix+attribute] || defaultValue;
    }

}