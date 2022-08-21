const Express = require("express")
const App = Express.Router()
const ContactModel = require("../Models/Contact")
const UserModel = require("../Models/User")
const jwt = require("jsonwebtoken")

App.get("/", (req, res) => {
    try {
        const { userName } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        UserModel.find({ userName: userName }).then((user) => {
            if (user.length) {
                ContactModel.find({ userId: userName }).then((contacts) => {
                    res.status(200).json(contacts)
                }).catch((err) => {
                    res.status(400).json("Process Issue")
                })
            } else {
                res.status(400).json("UnAuthorized User")
            }
        }).catch((err) => {
            res.status(400).json("Network Issue")
        })
    } catch (err) {
        res.status(400).json("Network Issue")
    }
})
App.post("/", (req, res) => {
    try {
        const { userName } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        UserModel.find({ userName: userName }).then((user) => {
            if (user.length) {
                ContactModel.find({ userId: userName }).then((posts) => {
                    if (posts.length) {
                        ContactModel.updateMany({ userId: userName }, { $push: { contact: req.body } }).then(async (post) => {
                            const lists = await ContactModel.find({ userId: userName })
                            let newlist = lists[0].contact
                            const newArr = newlist.map((item) => {
                                const newObj = Object.assign({}, item, {
                                    hiWorld: `${item.name}${item.designation}${item.company}${item.industry}${item.email}${item.phoneNumber}${item.country}`,
                                });
                                return newObj;
                            });
                            var uniqueItems = [];
                            var duplicateIds = [];
                            newArr.forEach((item) => {
                                if (uniqueItems.includes(item.hiWorld)) {
                                    duplicateIds.push(item._doc._id);
                                } else {
                                    uniqueItems.push(item.hiWorld);
                                }
                            });
                            let updated = await ContactModel.updateMany({userId:userName},{ $pull: { contact: { _id: [...duplicateIds] } } },{multi:true})
                            res.status(200).send("Data Added")
                        }).catch((err) => {
                            res.status(400).json("Process Issue")
                        })
                    } else {
                        ContactModel.create({ userId: userName, contact: req.body }).then(async(post) => {
                            const lists = await ContactModel.find({ userId: userName })
                            let newlist = lists[0].contact
                            const newArr = newlist.map((item) => {
                                const newObj = Object.assign({}, item, {
                                    hiWorld: `${item.name}${item.designation}${item.company}${item.industry}${item.email}${item.phoneNumber}${item.country}`,
                                });
                                return newObj;
                            });
                            var uniqueItems = [];
                            var duplicateIds = [];
                            newArr.forEach((item) => {
                                if (uniqueItems.includes(item.hiWorld)) {
                                    duplicateIds.push(item._doc._id);
                                } else {
                                    uniqueItems.push(item.hiWorld);
                                }
                            });
                            let updated = await ContactModel.updateMany({userId:userName},{ $pull: { contact: { _id: [...duplicateIds] } } },{multi:true})
                            res.status(200).send("Data Added")
                        }).catch((err) => {
                            res.status(400).json("Process Issue")
                        })
                    }
                }).catch((err) => {
                    res.status(400).json("Process Issue")
                })
            } else {
                res.status(400).json("UnAuthorized User")
            }
        }).catch((err) => {
            res.status(400).json("Network Issue")
        })
    } catch (err) {
        res.status(400).json("Network Issue")
    }
})

App.delete("/delete", (req, res) => {
    try {
        const { userName } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        UserModel.find({ userName: userName }).then((user) => {
            if (user.length) {
                ContactModel.updateMany({ userId: userName }, { $pull: { contact: { _id: { $in: req.body } } } }, { multi: true }).then((post) => {
                    res.status(200).send("Data Added")
                }).catch((err) => {
                    res.status(400).json("Process Issue")
                })
            } else {
                res.status(400).json("UnAuthorized User")
            }
        }).catch((err) => {
            res.status(400).json("Network Issue")
        })
    } catch (err) {
        res.status(400).json("Network Issue")
    }
})
App.put("/edit", (req, res) => {
    try {
        const { userName } = jwt.verify(req.headers.authorization, process.env.SECRET_KEY)
        UserModel.find({ userName: userName }).then((user) => {
            if (user.length) {
                 ContactModel.updateOne({ userId: userName },{$set :{
                    "contact.$[eleX].name" : `${req.body.name}`,
                    "contact.$[eleX].designation" : `${req.body.designation}`,
                    "contact.$[eleX].company" : `${req.body.company}`,
                    "contact.$[eleX].industry" : `${req.body.industry}`,
                    "contact.$[eleX].email" : `${req.body.email}`,
                    "contact.$[eleX].phoneNumber" : `${req.body.phoneNumber}`,
                    "contact.$[eleX].country" : `${req.body. country}`
                 }
                },{arrayFilters : [{"eleX._id" : `${req.body._id}`}]}).then((data)=>{
                    res.status(200).json("Dataupdated")
                 })
            } else {
                res.status(400).json("UnAuthorized User")
            }
        }).catch((err) => {
            res.status(400).json("Network Issue")
        })
    } catch (err) {
        res.status(400).json("Network Issue")
    }
})

module.exports = App 