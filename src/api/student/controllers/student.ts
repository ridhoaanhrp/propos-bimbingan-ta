/**
 * student controller
 */

import { factories } from '@strapi/strapi'

interface ILecturer {
    id: Number,
    lecturer_id: String,
    lecturer_code: String,
    name: String
}

interface IStudent {
    id: Number,
    name: String,
    student_id: String,
    title: String,
    created_at: Date,
    updated_at: Date,
    advisors: ILecturer[]
}

export default factories.createCoreController('api::student.student', ({strapi}) => ({
    async findOne(ctx){
        const { id } = ctx.params;

        const data = await strapi.query('api::student.student').findOne({
            where: { student_id: id },
            populate: { advisors: true,  guidance_progresses: true}
        });

        if(!data) {
            return ctx.notFound("NIM not found", { 
                message: "Input yang dimasukan tidak ditemukan dalam database"
            });
        }

        const advisors: ILecturer[] = data.advisors.map(item=> {
            return {
                id: item.id,
                lecturer_id: item.lecturer_id,
                lecturer_code: item.lecturer_code,
                name: item.name
            } as ILecturer
        })

        const response: IStudent = {
            id: data.id,
            name: data.name,
            student_id: data.student_id,
            title: data.title,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
            advisors: advisors
        }

        return response;

    },
    async find(ctx){
        const data = await strapi.query('api::student.student').findMany({
            populate: { advisors: true } 
        });

        const response: IStudent[] = data.map(item => {
            const advisors: ILecturer[] = item.advisors.map(item=> {
                return {
                    id: item.id,
                    lecturer_id: item.lecturer_id,
                    lecturer_code: item.lecturer_code,
                    name: item.name
                } as ILecturer
            })
            return {
                id: item.id,
                name: item.name,
                student_id: item.student_id,
                title: item.title,
                created_at: item.createdAt,
                updated_at: item.updatedAt,
                advisors: advisors
            } as IStudent
        })
        
        return response;
    }
}));
