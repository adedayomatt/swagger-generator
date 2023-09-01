const $ = require("utility");
const Placeholder = require('./Placeholder');

module.exports =  class Schema {

    sections = ["path", "payload", "header", "query"];
    payload = {};
    schema = {};
    contentTypes = [];
    placeholder = new Placeholder();
    registry = {};

    setPayload(payload = {}) {
        $._set(this.placeholder, { format: "" });
        this.placeholder = $._set(this.placeholder, {
            attributePrefix: "__"
        });
        $._crawlObject(payload, (item, key, address) => {
            if($._isString(item)) {
                $._set(this.placeholder, { format: "##" });
                this.placeholder.extractFrom(item)
                .forEach(placeholder => {
                    let resolvedPlaceholder = null;
                    if(placeholder.match(/\{.*\}/)) {
                        resolvedPlaceholder = this.placeholder.resolveObject(JSON.parse(placeholder));
                        const source = this.placeholder.getAttribute(resolvedPlaceholder, "source")
                        if(source.match(/registry.*/)) {
                            const registryKey = source.split("registry.")[1];
                            if(this.registry[registryKey] && $._isObject(this.registry[registryKey])) {
                                resolvedPlaceholder = this.placeholder.resolveObject(this.registry[registryKey])
                            }
                        }
                    }
                    if(resolvedPlaceholder) {
                        let location = this.placeholder.getAttribute(resolvedPlaceholder, "source");
                        if(this.contentTypes.includes("application/json") && location.startsWith("payload.")) {
                            location = location.replace("payload.", "payload.body.");
                        }
                        if(location.startsWith("params.")) {
                            location = location.replace("params.", "path.")
                        }
                        if(location.startsWith("headers.")) {
                            location = location.replace("headers.", "header.")
                        }
                        const register = this.placeholder.getAttribute(resolvedPlaceholder, "$ref")
                        if(register){
                            resolvedPlaceholder = this.placeholder.resolve(
                                placeholder + this.placeholder.attributeSeparator + this.registry[register]
                            )
                        }
                        $._setObjectItem(this.schema, location, resolvedPlaceholder)
                    }
                })
            }
            return item;
        })
        return $._set(this, { payload })
    }

    setRegistry(registry = {}) {
        return $._set(this, { registry })
    }
    setContentTypes(contentTypes) {
        return $._set(this, { contentTypes })
    }

    getSchema() {
        return $._get(this, "schema")
    }

    getResolvedUrl(prefix, { name, slug }) {
        slug = slug ? slug : name;
        slug = slug.startsWith("/") ? slug : `/${slug}`;
        slug = "/" + prefix + slug;
        const paths = this.schema["path"] || {};
        for (let path in paths){
            slug += `/{${path}}`
        }
        return slug;
    }
}
