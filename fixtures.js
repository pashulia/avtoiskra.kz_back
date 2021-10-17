const mongoose = require("mongoose");
const {nanoid} = require("nanoid");
const config = require("./config");

const Category = require("./models/Category");
const Factory = require("./models/Factory");
const Product = require("./models/Product");
const User = require("./models/User");

mongoose.connect(config.getDbUrl(), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;

db.once('open', async () => {
    try {
        await db.dropCollection('categories');
        await db.dropCollection('products');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not presented. Skipping drop');
    }

    const [sparkplugCategory, ignitionleadsCategory, brakeCategory, beltCategory] = await Category.create({
        title: "sparkPlug",
        description: "spark plug"
    }, {
        title: "ignitionLeads",
        description: "ignition leads"
    }, {
        title: "brake",
        description: "brake fad"
    }, {
        title: "belt",
        description: "timing belt"
    });

    const [NGKFactory, DensoFactory, BoschFactory, TeslaFactory, DaycoFactory, HiQFactory, GarantiFactory, GMBFactory] = await Factory.create(
        { title: 'NGK»' },
        { title: 'Denso' },
        { title: 'Bosch' },
        { title: 'Tesla' },
        { title: 'Dayco' },
        { title: 'Hi-Q' },
        { title: 'Garanti' },
        { title: 'GMB' }
      );

    await Product.create({
        title: "Denso K20tt#4",
        price: 1490,
        category: sparkplugCategory._id,
        factory: DensoFactory._id,
        image: "DensoK20TT4bg.jpg"
    }, {
        title: "Denso KJ16CRL11",
        price: 5990,
        category: sparkplugCategory._id,
        factory: DensoFactory._id,
        image: "hdd.jpg"
    }, {
        title: "NGK 1208ILZFR6D-11",
        price: 1500,
        category: sparkplugCategory._id,
        factory: NGKFactory._id,
        image: "hdd.jpg"
    }, {
        title: "NGK 1682 DCPR7EGP",
        price: 2000,
        category: sparkplugCategory._id,
        factory: NGKFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Bosch FGR7DQP",
        price: 3400,
        category: sparkplugCategory._id,
        factory: BoschFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Bosch ZR7SI332S",
        price: 3700,
        category: sparkplugCategory._id,
        factory: BoschFactory._id,
        image: "hdd.jpg"
    }, {
        title: "TESLA T429B",
        price: 7990,
        category: ignitionleadsCategory._id,
        factory: TeslaFactory._id,
        image: "hdd.jpg"
    }, {
        title: "TESLA T003B",
        price: 2400,
        category: ignitionleadsCategory._id,
        factory: TeslaFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Hi-Q SP1206",
        price: 10000,
        category: brakeCategory._id,
        factory: HiQFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Hi-Q SP1048",
        price: 6000,
        category: brakeCategory._id,
        factory: HiQFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Dayco 4PK1215",
        price: 3990,
        category: beltCategory._id,
        factory: DaycoFactory._id,
        image: "hdd.jpg"
    }, {
        title: "Dayco 4PK862",
        price: 4000,
        category: beltCategory._id,
        factory: DaycoFactory._id,
        image: "hdd.jpg"
    });

    await User.create({
        username: "user",
        password: "user",
        token: nanoid(),
        role: "user"
    }, {
        username: "admin",
        password: "admin",
        token: nanoid(),
        role: "admin"
    });
    db.close();
});

