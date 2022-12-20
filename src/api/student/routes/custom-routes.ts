"use strict";

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/students/login",
            handler: "custom-controllers.login"
        },
        {
            method: "POST",
            path: "/students/register",
            handler: "student.create"
        }
    ]
}