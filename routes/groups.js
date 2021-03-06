let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');
let images = require('../images');

let {GroupController} = require('../models/group');
let {UserController} = require('../models/user');
let {PlaceController} = require('../models/place');
let ServerError = require('../error');
let middleware = require('../middleware');

router.get('/:id/members', jsonParser, middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;

    console.log('getting members...')

    if (id == undefined) {
        res.statusMessage = "No id given to get members of group";
        return res.status(406).send();
    }

    GroupController.getMembersOfGroupById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }

            return res.status(200).json(group.members);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});


router.post('/create', jsonParser, middleware.isLoggedIn, (req, res) => {
    let groupName = req.body.name;
    let groupDescription = req.body.description;
    let managerId = req.body.manager_id;

    if (groupName == undefined || groupDescription == undefined || managerId == undefined) {
        res.statusMessage = "Parameters to create group incomplete";
        return res.status(406).send();
    }

    let image = images[Math.floor(Math.random() * images.length)];

    let newGroup = {
        name: groupName,
        description: groupDescription,
        dateCreated: new Date(),
        image: image,
        manager: managerId,
        members: [managerId]
    }

    GroupController.create(newGroup)
        .then(ng => {
            return res.status(201).json(ng);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group couldn't be created";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.put('/update/:id', jsonParser, middleware.isLoggedIn, async (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to update";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }

            let {name, description} = req.body;
        
            if (name == undefined && description == undefined) {
                res.statusMessage = "No parameters to modify in update";
                return res.status(409).send();
            }

            let newGroup = {};

            if (name != undefined) {
                newGroup.name = name;
            }
            if (description != undefined) {
                newGroup.description = description;
            }

            return GroupController.update(id, newGroup);
        })
        .then(ng => {
            return res.status(202).json(ng);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.put('/:id_group/add_member', jsonParser, middleware.isLoggedIn, (req, res) => {
    let groupId = req.params.id_group;
    let memberId = req.body.id_member;

    if (groupId == undefined) {
        res.statusMessage = "No group id given to add a member to the group";
        return res.status(406).send();
    }

    if (memberId == undefined) {
        res.statusMessage = "No member id given to add a member to the group"
        return res.status(406).send();
    }

    let foundGroup = {}

    GroupController.getById(groupId)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "Group ID not found");
            }

            if (group.members.includes(memberId)) {
                throw new ServerError(409, "Member already in group");
            }

            foundGroup = group;

            return UserController.getById(memberId);
        })
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "User ID not found");
            }

            let newGroup = {};
            let newMembers = foundGroup.members;
            newMembers.push(memberId);
            newGroup.members = newMembers;

            return GroupController.update(groupId, newGroup);
        })
        .then(ng => {
            if (ng == null) {
                throw new ServerError(404, "Group ID not found");
            }

            return res.status(202).json(ng)
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            return res.status(error.code).send();
        });
});

router.put('/:id_group/add_member_email', jsonParser, middleware.isLoggedIn, (req, res) => {
    let groupId = req.params.id_group;
    let memberEmail = req.body.email_member;

    if (groupId == undefined) {
        res.statusMessage = "No group id given to add a member to the group";
        return res.status(406).send();
    }

    if (memberEmail == undefined) {
        res.statusMessage = "No member email given to add a member to the group"
        return res.status(406).send();
    }

    let foundGroup = {}

    GroupController.getById(groupId)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "Group ID not found");
            }

            foundGroup = group;

            return UserController.getByEmail(memberEmail);
        })
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "User ID not found");
            }

            if (foundGroup.members.includes(user._id)) {
                throw new ServerError(409, "Member already in group");
            }

            let newGroup = {};
            let newMembers = foundGroup.members;
            newMembers.push(user._id);
            newGroup.members = newMembers;

            return GroupController.update(groupId, newGroup);
        })
        .then(ng => {
            if (ng == null) {
                throw new ServerError(404, "Group ID not found");
            }

            return res.status(202).json(ng)
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            return res.status(error.code).send();
        });
});

router.delete('/delete/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No group id given to delete";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "Group with ID given doesn't exist");
            }

            return PlaceController.deleteByGroupId(id);
        })
        .then(places => {
            return GroupController.delete(id);
        })
        .then(group => {
            return res.status(204).send(group);
        })
        .catch(error => {
            if (error.code === 404) {
                res.statusMessage = error.message;
                return res.status(404).send();
            }

            res.statusMessage = "Database error";
            return res.status(500).send();
        })
})

router.delete('/:id_group/delete-member/:id_member', jsonParser, middleware.isLoggedIn, (req, res) => {
    let groupId = req.params.id_group;
    let memberId = req.params.id_member;
    
    if (groupId == undefined) {
        res.statusMessage = "No group id given to delete a member from the group";
        return res.status(406).send();
    }

    if (memberId == undefined) {
        res.statusMessage = "No member id given to delete a member from the group"
        return res.status(406).send();
    }

    GroupController.getById(groupId)
        .then(group => {
            if (group == null) {
                throw new ServerError(404);
            }

            let member = group.members.find((user) => {
                console.log('Comparing..', user, memberId);
                if (user == memberId) {
                    console.log('FOUND')
                    return user;
                }
            });

            if (member == undefined || member == null) {
                throw new ServerError(404, "That member doesn't exist in the given group")
            }

            let index = group.members.findIndex(user => user === member._id);
            group.members.splice(index, 1);
            let newGroup = group;

            console.log('group id ', group._id);

            console.log('new members ', newGroup.members)

            return GroupController.update(groupId, newGroup);
        })
        .then(ng => {
            return res.status(202).json({});
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = error.message;
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.get('/by-member/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;

    let term = req.query.term;

    console.log(req.headers.authorization);

    if (id == undefined) {
        res.statusMessage = "No ID given to show groups of user";
        return res.status(406).send();
    }
    
    GroupController.getByMemberId(id)
        .then(groupsOfUser => {
            if (groupsOfUser == null) {
                throw new ServerError(404);
            }

            if (term == null || term == undefined || term == '') {
                return res.status(200).json(groupsOfUser);
            }

            term = term.toLowerCase();

            let matchedGroups = [];

            groupsOfUser.forEach(group => {
                if (group.name.toLowerCase().includes(term)) {
                    matchedGroups.push(group);
                }
            });

            return res.status(200).json(matchedGroups);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.get('/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get group";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(group);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

module.exports = router;