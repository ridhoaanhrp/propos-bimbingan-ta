import * as _ from "lodash";
import { getService } from "@strapi/plugin-users-permissions/server/utils";
import * as bcrypt from "bcrypt";
import { factories } from '@strapi/strapi';

interface IUser {
    id: Number,
    name: String,
    lecturer_id: String,
    lecturer_code: String,
    token: String
}

module.exports = factories.createCoreController('api::lecturer.lecturer', ({ strapi }) => ({
    async login(ctx){
        const { identifier, password } = ctx.request.body;

        const user = await strapi.query('api::lecturer.lecturer').findOne({
            where: {$or:[{ lecturer_code: identifier }, { lecturer_id: identifier }]}
        })

        if(user){
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if(isPasswordCorrect){
                const token = getService('jwt').issue(_.pick(user, ['id']));
                let response: IUser = {
                    id: user.id,
                    name: user.name,
                    lecturer_id: user.lecturer_id,
                    lecturer_code: user.lecturer_code,
                    token: token
                }

                return response
            }
        }
        return ctx.notFound("You have entered an invalid NIP, Lecturer Code, or password");

    }
})) 