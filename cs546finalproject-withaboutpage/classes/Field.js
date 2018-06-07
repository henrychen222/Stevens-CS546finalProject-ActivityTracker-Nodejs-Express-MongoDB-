class Field{
   // var id;
   // var name;
  //  var description;
  //  var type;
  //  var active;
   // var required;

    constructor(id, name, description, type, active, required){
        this._id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.active = active;
        this.required = required;
    }
}

module.exports = Field;
