const mongoCollections = require("../config/mongoCollections");
const ActivityType = require("../classes/ActivityType");
const activtyTypes = mongoCollections.activtyTypes;
const uuidv1 = require('uuid/v1');

let exportedMethods = {
    getAllActivtyTypes() {
        return activtyTypes().then(activtyTypesCollection => {
            return activtyTypesCollection.find().toArray();
        });
    },
    getActivtyTypesById(id) {
        return activtyTypes().then(activtyTypesCollection => {
            return activtyTypesCollection.findOne({ _id: id }).then(activtyType => {
                if (!activtyType) throw "Activity Type not found";
            return activtyType;
        });
    });
    },
    addActivtyType(name, description, active, fields) {

        if (typeof name !== "string") throw "No name provided";
        if (typeof description !== "string") throw "No description provided";
        if (typeof active !== "boolean") throw "active not set";
        if (!Array.isArray(fields)) {
            throw "fields not an array"
        }

        const activty = new ActivityType(uuidv1(), name,description,active,fields);

        return activtyTypes().then(activtyTypesCollection => {


        return activtyTypesCollection
            .insertOne(activty)
            .then(newInsertInformation => {
                return newInsertInformation.insertedId;
            })
        .then(newId => {
            return this.getActivtyTypesById(newId);
        });
        });
    },
    removeActivityType(id) {
        return activtyTypes().then( activtyTypesCollection => {
            return activtyTypesCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete activity type with id of ${id}`;
                } else {
                }
            });
        });
    },
    updateActivityType(id, updatedActivityType) {
        const updatedActivityTypeData = {};

        if(updatedActivityType.name){

            if (typeof updatedActivityType.name !== "string") throw "No name provided";
            console.log("here");
            updatedActivityTypeData.name = updatedActivityType.name;
        }

        if(updatedActivityType.description){
            if (typeof updatedActivityType.description !== "string") throw "No description provided";
            updatedActivityTypeData.description = updatedActivityType.description;
        }

        if(updatedActivityType.active != null){
            if (typeof updatedActivityType.active !== "boolean") throw "No active status provided";
            updatedActivityTypeData.active = updatedActivityType.active;
        }

        if(updatedActivityType.fields){
            if (typeof updatedActivityType.fields !== "object") throw "No fields provided";
            updatedActivityTypeData.fields = updatedActivityType.fields;
        }

        let updateCommand = { $set: updatedActivityTypeData};

        const query = {
            _id: id
        };

        return activtyTypes().then( activtyTypesCollection => {
            return activtyTypesCollection
                .updateOne(query,updateCommand)
                .then(newInsertInformation => {
                   return this.getActivtyTypesById(id);
                });
        });

    },
    replaceActivityType(id, name, description, active, fields) {
        const updatedActivityTypeData = {};

        if(name && description && active != null && fields){
            if(updatedActivityType.name){
                if (typeof name !== "string") throw "No name provided";
                updatedActivityTypeData.name = name;
            }

            if(description){
                if (typeof description !== "string") throw "No description provided";
                updatedActivityTypeData.description = description;
            }

            if(active != null){
                if (typeof active !== "boolean") throw "No active status provided";
                updatedActivityTypeData.active = active;
            }

            if(fields){
                if (typeof fields !== "object") throw "No fields provided";
                updatedActivityTypeData.fields = fields;
            }

        } else {
            throw "Not all fields supplied";
        }


        let updateCommand = { $set: updatedActivityTypeData};

        const query = {
            _id: id
        };

        return activtyTypes().then( activtyTypesCollection => {
            return activtyTypesCollection
                .updateOne(query,updateCommand)
                .then(newInsertInformation => {
                return this.getActivtyTypesById(id);
            });
        });

    }
};

module.exports = exportedMethods;