const mongoCollections = require("../config/mongoCollections");
const userActivities = mongoCollections.userActivities;
const activtyTypes = mongoCollections.activtyTypes;
const uuidv1 = require('uuid/v1');

let exportedMethods = {
    getAllUserActivities() {
        return userActivities().then(userActivitiesCollection => {
            return userActivitiesCollection.find().toArray();
        });
    },getAllUserActivitiesByUserId(userId) {
        return userActivities().then(userActivitiesCollection => {
            return userActivitiesCollection.aggregate([
                { $lookup:
                        {
                            from: 'ACTIVITY_TYPES',
                            localField: 'activityType',
                            foreignField: '_id',
                            as: 'activity'
                        },
                },{
                    $match:{userId: userId}
                }
            ]).toArray();
        });
    },
    getUserActivityStats(userId) {
        return userActivities().then(userActivitiesCollection => {
            return userActivitiesCollection.aggregate([
                {
                    $match:{userId: userId}
                },
                { $lookup:
                        {
                            from: 'ACTIVITY_TYPES',
                            localField: 'activityType',
                            foreignField: '_id',
                            as: 'activity'
                        },
                },
                {$unwind: '$activity'},
                {"$group" : {_id:"$activity.name", count:{$sum:1}}}
            ]).toArray();
        });
    },
    getAllUserActivityStats() {
        return userActivities().then(userActivitiesCollection => {
            return userActivitiesCollection.aggregate([
                { $lookup:
                        {
                            from: 'ACTIVITY_TYPES',
                            localField: 'activityType',
                            foreignField: '_id',
                            as: 'activity'
                        },
                },
                {$unwind: '$activity'},
                {"$group" : {_id:"$activity.name", count:{$sum:1}}}
            ]).toArray();
        });
    },
    getUserActivitiesById(id) {
        return userActivities().then(userActivitiesCollection => {
            return userActivitiesCollection.aggregate([
                {
                    $match:{_id: id}
                },
                { $lookup:
                        {
                            from: 'ACTIVITY_TYPES',
                            localField: 'activityType',
                            foreignField: '_id',
                            as: 'activity'
                        },
                },
                {$unwind: '$activity'}
            ]).toArray();
        });
    },
    addUserActivity(data) {

        if (typeof data !== "object") throw "No object provided";
        if (typeof data.activityType !== "string") throw "No activity type provided";
        console.log(data);
        return activtyTypes().then(activtyTypesCollection => {
            console.log( data.activtyType);
            return activtyTypesCollection.findOne({_id: data.activityType}).then(activtyType => {
                if (!activtyType) throw "Activity Type not found";
                let errorString = "";
                for ( let key in activtyType.fields){
                    console.log(activtyType.fields[key]);
                    fieldKey = activtyType.fields[key].name.replace(/ /g,'-').toLowerCase();

                    let type = activtyType.fields[key].type.toLowerCase();
                    if(data[fieldKey] === ""){
                        errorString = errorString + activtyType.fields[key].name +" not valid, ";
                        continue;
                    }
                    switch (activtyType.fields[key].type.toLowerCase()) {
                        case "string":
                            console.log("string");
                            if (typeof data[fieldKey] !== "string" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "number":
                            console.log("number");
                            if (typeof Number(data[fieldKey]) !== "number" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "date":
                            console.log("date");
                            if (typeof data[fieldKey] !== "string" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "boolean":
                             if(data[fieldKey] == null || data[fieldKey] == undefined) break;
                            if ( data[fieldKey] !== "true" && data[fieldKey] !== true && data[fieldKey] !== "false" && data[fieldKey] !== false  ) errorString = errorString +  activtyType.fields[key].name +" not valid, ";
                            break;
                        case "currency":
                            console.log("currency");
                            if (typeof Number(data[fieldKey]) !== "number" && data[fieldKey].length > 0) errorString = errorString +  activtyType.fields[key].name +" not valid, ";;
                            break
                        default:
                            console.log("default");
                            throw 'Not a valid type';
                    }
                }
                if(errorString !== "") throw errorString.substring(0, errorString.length - 2);

                data._id = uuidv1();
                return userActivities().then( userActivitiesCollection => {
                    return  userActivitiesCollection
                        .insertOne(data)
                        .then(newInsertInformation => {
                            return newInsertInformation.insertedId;
                        })
                        .then(newId => {
                            return "true";
                        });
                });
                return activtyType;
            });
        });


    },
    removeUserActivity(id) {
        return userActivities().then( userActivitiesCollection => {
            return userActivitiesCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete activity with id of ${id}`;
                } else {
                }
            });
        });
    },
    updateUserActivity(id, data) {
        let updateUserActivityData = {};
        if (typeof data !== "object") throw "No object provided";
        console.log(data);
        return activtyTypes().then(activtyTypesCollection => {
            console.log( data.activityType);
            return activtyTypesCollection.findOne({_id: data.activityType}).then(activtyType => {
                if (!activtyType) throw "Activity Type not found";
                let errorString = "";
                for ( let key in activtyType.fields){
                    console.log(activtyType.fields[key]);
                    fieldKey = activtyType.fields[key].name.replace(/ /g,'-').toLowerCase();

                    let type = activtyType.fields[key].type.toLowerCase();
                    if(data[fieldKey] === "userId" || data[fieldKey] === "activityType" || data[fieldKey] === "_id"){
                        continue;
                    }

                    if(data[fieldKey] === ""){
                        errorString = errorString + activtyType.fields[key].name +" not valid, ";
                        continue;
                    }
                    switch (activtyType.fields[key].type.toLowerCase()) {
                        case "string":
                            console.log("string");
                            if (typeof data[fieldKey] !== "string" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "number":
                            console.log("number");
                            if (typeof Number(data[fieldKey]) !== "number" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "date":
                            console.log("date");
                            if (typeof data[fieldKey] !== "string" && data[fieldKey].length > 0) errorString = errorString + activtyType.fields[key].name +" not valid, ";
                            break;
                        case "boolean":
                            if(data[fieldKey] == null || data[fieldKey] == undefined) break;
                            if ( data[fieldKey] !== "true" && data[fieldKey] !== true && data[fieldKey] !== "false" && data[fieldKey] !== false  ) errorString = errorString +  activtyType.fields[key].name +" not valid, ";
                            break;
                        case "currency":
                            console.log("currency");
                            if (typeof Number(data[fieldKey]) !== "number" && data[fieldKey].length > 0) errorString = errorString +  activtyType.fields[key].name +" not valid, ";;
                            break
                        default:
                            console.log("default");
                            throw 'Not a valid type';
                    }

                    updateUserActivityData[fieldKey] = data[fieldKey];
                }
                if(errorString !== "") throw errorString.substring(0, errorString.length - 2);

                let updateCommand = { $set: updateUserActivityData};

                const query = {
                    _id: data._id
                };

                return userActivities().then( userActivitiesCollection => {
                    return userActivitiesCollection
                        .updateOne(query,updateCommand)
                        .then(newInsertInformation => {
                            return this.getUserActivitiesById(id);
                        });
                });
            });
        });




    }/*,
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

        return userActivities().then( activtyTypesCollection => {
            return activtyTypesCollection
                .updateOne(query,updateCommand)
                .then(newInsertInformation => {
                return this.getActivtyTypesById(id);
            });
        });

    }*/
};

module.exports = exportedMethods;