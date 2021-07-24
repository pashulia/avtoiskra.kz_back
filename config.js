const path = require("path");

const rootPath = __dirname;

let dbName = "avtoiskra";
if (process.env.NODE_ENV === "test") {
    dbName = "avtoiskra_test"
}

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, "public", "uploads"),
    db: {
        name: dbName,
        url: "mongodb://localhost/"
    },
    getDbUrl() {
        return this.db.url + this.db.name
    },
    fb: {
        appId: "229425875653826",
        appSecret: "97290db58d85fe8dd9a8b6503f2f21c7",
    }
};