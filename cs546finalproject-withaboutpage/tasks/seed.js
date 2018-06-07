const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const Field = require("../classes/Field");
const activityType = data.activityTypes;
const userActivity = data.userActivities;
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt-nodejs');
const dbOperation = require("../data/users");

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    /**
     * Creating Activity Types
     */
    let fields = [new Field(uuidv1(), "location", "Where did the activity take place aka what mountain", "String", true, true),
        new Field(uuidv1(), "Date", "Date of the Activity", "Date", true, true),
        new Field(uuidv1(), "Skis", "What Skis did you use", "String", true, true),
        new Field(uuidv1(), "Number of Runs", "How many runs did you take?", "Number", true, true),
        new Field(uuidv1(), "Ticket Cost", "How much did you pay for a lift ticket?", "Currency", true, true),
        new Field(uuidv1(), "Discount Used", "Did you get a discount on the lift ticket?", "Boolean", true, true)];
    console.log(fields);
    let activity = await activityType.addActivtyType("Downhill Skiing", "Activity of skiing down a hill or mountain", true, fields);
    const Skiingid = activity._id;

    fields = [new Field(uuidv1(), "location", "Where did the activity take place aka what mountain/Track", "String", true, true),
        new Field(uuidv1(), "Date", "Date of the Activity", "Date", true, true),
        new Field(uuidv1(), "Skis", "What Skis did you use", "String", true, true),
        new Field(uuidv1(), "Distance Skied", "How far did you ski?", "Number", true, true)];
    console.log(fields);
    activity = await activityType.addActivtyType("Cross Country Skiing", "Activity of nordic skiing", true, fields);
    const xcid = activity._id;

    fields = [new Field(uuidv1(), "location", "Where did the activity take place", "String", true, true),
        new Field(uuidv1(), "Date", "Date of the Activity", "Date", true, true),
        new Field(uuidv1(), "Miles", "How Far did you run?", "Number", true, true),
        new Field(uuidv1(), "Shoes", "What shoes did you wear?", "String", true, true),
        new Field(uuidv1(), "Duration", "How long did you run for in minutes?", "Number", true, true)];
    console.log(fields);
    activity = await activityType.addActivtyType("Run", "Activity of going for a run", true, fields);
    runId = activity._id;

    /**
     * creating demo user john snow
     */
    const hash = await bcrypt.hashSync("Password1234");

    //add the registered email and password to database  email and password are the key  (html id)
    await dbOperation.createUser("John", "Snow", "jsnow@stevens.edu", hash, "01/1/1985", "Male");
    const user = await dbOperation.getUser("jsnow@stevens.edu");

    /**
     * Logging activities for john snow
     */
    let act = {
        activityType: Skiingid,
        location: 'Mountain Creek',
        date: '2018-01-01',
        skis: 'Rossi Soul 7',
        'number-of-runs': '15',
        'ticket-cost': '76',
        userId: user._id
    }

    await userActivity.addUserActivity(act);

    act = {
        activityType: Skiingid,
        location: 'Vail',
        date: '2018-01-20',
        skis: 'Rossi Soul 7',
        'number-of-runs': '23',
        'ticket-cost': '150',
        userId: user._id
    }
    await userActivity.addUserActivity(act);

    act = {
        activityType: Skiingid,
        location: 'Beaver Creek',
        date: '2018-01-21',
        skis: 'Rossi Soul 7',
        'number-of-runs': '20',
        'ticket-cost': '150',
        userId: user._id
    }
    await userActivity.addUserActivity(act);

    act = {
        activityType: Skiingid,
        location: 'Keystone',
        date: '2018-01-20',
        skis: 'Rossi Soul 7',
        'number-of-runs': '25',
        'ticket-cost': '150',
        userId: user._id
    }
    await userActivity.addUserActivity(act);

    act = { activityType: xcid,
        location: 'Central Park',
        date: '2018-02-07',
        skis: 'Rossi Xc Skis',
        'distance-skied': '4',
        userId: user._id }
    await userActivity.addUserActivity(act);

    act = { activityType: xcid,
        location: 'Central Park',
        date: '2018-02-07',
        skis: 'Rossi Xc Skis',
        'distance-skied': '10',
        userId: user._id }
    await userActivity.addUserActivity(act);

    act = { activityType: runId,
        location: 'Hoboken Water Front',
        date: '2018-05-08',
        miles: '5',
        shoes: 'Nike Trainers',
        duration: '46',
        userId: user._id }

    await userActivity.addUserActivity(act);

    console.log("Done seeding database");
    await db.serverConfig.close();
};

main().catch(console.log);