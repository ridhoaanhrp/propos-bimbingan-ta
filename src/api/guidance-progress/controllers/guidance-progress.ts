/**
 * guidance-progress controller
 */

import { factories } from '@strapi/strapi'

interface IGuidance {
    id: Number,
    note: String,
    to_do: String,
    date: Date,
    student: {
        id: Number,
        student_id: String,
        name: String,
        title: String
    },
    created_at: Date,
    updated_at: Date 

}

export default factories.createCoreController('api::guidance-progress.guidance-progress', ({strapi}) => ({
    async findOne(ctx) {
        const { id } = ctx.params;

        const data = await strapi.query('api::guidance-progress.guidance-progress').findMany({
            populate: { student: true },
            orderBy: { createdAt: 'desc' }
        })

        if(!data) {
            return ctx.notFound("ID not found", { 
                message: "Input yang dimasukan tidak ditemukan dalam database"
            });
        }

        let collection: IGuidance[] = []
        for (const item of data) {
            if(item.student.student_id == id){
                collection.push({
                    id: item.id,
                    note: item.note,
                    to_do: item.to_do,
                    date: item.date,
                    student: {
                        id: item.student.id,
                        name: item.student.name,
                        title: item.student.title,
                        student_id: item.student.student_id
                    },
                    created_at: item.createdAt,
                    updated_at: item.updatedAt
                });
            }
        }

        return collection;
    },
    async find(ctx) {
        const data = await strapi.query('api::guidance-progress.guidance-progress').findMany({
            populate: { student: true },
            orderBy: { createdAt: 'desc' }
        })

        let collection: IGuidance[] = []
        for (const item of data) {
            collection.push({
                id: item.id,
                note: item.note,
                to_do: item.to_do,
                date: item.date,
                student: {
                    id: item.student.id,
                    name: item.student.name,
                    title: item.student.title,
                    student_id: item.student.student_id
                },
                created_at: item.createdAt,
                updated_at: item.updatedAt
            });
        }


        return collection;
    },
}));
