class ActivityType {

    constructor(id, name, description, active, fields) {
        this._id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.fields = fields;
    }

    addField(fieldObj){
        this.fields.push(fieldObj);
    }

}

module.exports = ActivityType;