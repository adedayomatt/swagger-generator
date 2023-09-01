const $ = require('utility');
const SwaggerSetup = require('./setup/Swagger');
const SwaggerInfo = require('./setup/SwaggerInfo');
const SwaggerTag = require('./setup/SwaggerTag');
const SwaggerContact = require('./setup/SwaggerContact');
const SwaggerExternalDocs = require('./setup/SwaggerExternalDocs');
const SwaggerTenantCollection = require('./tenant/Collection');
const SwaggerTenant = require("./tenant/Tenant");

module.exports  = {

    exampleSetup: require("./swagger-structure-example"),

    getTenantsSetup: (tenantsList = [], config = {}) => {
        const info = $._set(new SwaggerInfo(), {
            title: config.title || "Gateway Specifications",
            description: "Endpoints documentation for "+tenantsList.map(t => t.name).join(", "),
            version: config.version || "1.0",
            contact: $._set(new SwaggerContact(), {
                name: config.contact_name || "KongaPay Engineering",
                url: config.contact_url || "https://kongapay.com",
                email: config.contact_email || "kongapay.engineering@konga.com"
            })
        })

        const tenantCollection = new SwaggerTenantCollection(tenantsList);

        const paths = tenantCollection.pathCollection();
        const definitions = tenantCollection.definitionCollection();
        const externalDocs = $._set(new SwaggerExternalDocs(), config.externalDoc)
        const servers = config.servers
            ? config.servers.split(',')
                .map(server => $._set(new SwaggerExternalDocs(), {
                    url: server
                }))
            : []

        const tags = tenantsList.map(tenant => {
            return $._set(new SwaggerTag(), {
                name: tenant.name,
                description: `API calls for ${tenant.name}`,
                externalDocs: $._set(new SwaggerExternalDocs(), {
                    url: tenant.base_url,
                    description: "Base Url"
                })
            })
        });

        return $._set(new SwaggerSetup(), {
            servers,
            tags,
            info,
            paths,
            definitions,
            externalDocs
        }).build();
    },

    getTenantSetup: (singleTenant = {}, config ={}) => {
        const info = $._set(new SwaggerInfo(), {
            title: config.title || "Gateway Specifications",
            description: "Endpoints documentation for "+singleTenant.name,
            version: config.version || "1.0",
        })

        const tenant = new SwaggerTenant(singleTenant);
        const paths = tenant.pathCollection();
        const definitions = tenant.definitionCollection();

        const externalDocs = $._set(new SwaggerExternalDocs(), config.externalDoc)

        const tag = $._set(new SwaggerTag(), {
            name: singleTenant.name,
            description: `API calls for ${singleTenant.name}`,
            externalDocs: $._set(new SwaggerExternalDocs(), {
                url: singleTenant.base_url,
                description: "Base Url"
            })
        })

        const servers = config.servers
            ? config.servers.split(',')
                .map(server => $._set(new SwaggerExternalDocs(), {
                    url: server
                }))
            : []

        return $._set(new SwaggerSetup(), {
            servers,
            tags: [tag],
            info,
            paths,
            definitions,
            externalDocs
        }).build();
    }
}
