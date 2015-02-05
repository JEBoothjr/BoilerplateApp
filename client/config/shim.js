module.exports = {
    "jquery": "$",
    "underscore": "_",
    "backbone": {
        "exports": "Backbone",
        "depends": {
            "jquery": "$",
            "underscore": "_"
        }
    },
    "backbone.babysitter": {
        "exports": "Backbone.BabySitter",
        "depends": {
            "backbone": "Backbone"
        }
    },
    "backbone.wreqr": {
        "exports": "Backbone.Wreqr",
        "depends": {
            "backbone": "Backbone"
        }
    },
    "backbone.marionette": {
        "exports": "Marionette",
        "depends": {
            "backbone": "Backbone",
            "backbone.wreqr": "Backbone.Wreqr",
            "backbone.babysitter": "Backbone.BabySitter"
        }
    }
};
