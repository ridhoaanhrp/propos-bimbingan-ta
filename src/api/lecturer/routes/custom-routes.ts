"use strict";

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/lecturers/login",
            handler: "custom-controllers.login"
        },
        {
            method: "POST",
            path: "/lecturers/register",
            handler: "lecturer.create"
        }
    ]
}