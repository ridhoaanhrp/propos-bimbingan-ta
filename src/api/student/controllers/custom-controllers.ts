import * as _ from "lodash";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import * as bcrypt from "bcrypt";
import { factories } from '@strapi/strapi';

interface IUser {
    id: Number,
    name: String,
    student_id: String,
    token: String
}

module.exports = factories.createCoreController('api::student.student', ({ strapi }) => ({
    async login(ctx){
        const { identifier, password } = ctx.request.body;

        const user = await strapi.query('api::student.student').findOne({
            where: { student_id: identifier }
        })

        if(user){
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if(isPasswordCorrect){
                const token = getService('jwt').issue(_.pick(user, ['id']));
                let response: IUser = {
                    id: user.id,
                    name: user.name,
                    student_id: user.student_id,
                    token: token
                }

                return response
            }
        }
        return ctx.notFound("You have entered an invalid NIM or password");

    }
}))