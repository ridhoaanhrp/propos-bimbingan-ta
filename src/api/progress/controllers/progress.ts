/**
 * progress controller
 */

import { factories } from '@strapi/strapi'

interface IProgress {
    id: Number,
    student_id: String,
    lecturer_id: String,
    lecturer_code: String,
    progress_note_id: Number,
    progress_value_id: Number
    abstract: {
        value: Number,
        note: String
    },
    chapter_one: {
        value: Number,
        note: String
    },
    chapter_two: {
        value: Number,
        note: String
    },
    chapter_three: {
        value: Number,
        note: String
    },
    reference: {
        value: Number,
        note: String
    },
    total: Number,
    created_at: Date,
    updated_at: Date
}

function getAverage(item: number[]): number{
    const sum = item.reduce((a, b) => a + b, 0);
    const average = (sum/item.length) || 0;
    const response = Math.floor(average);
    return response;
}

export default factories.createCoreController('api::progress.progress', ({strapi}) => ({
    async findOne(ctx){
        const { id } = ctx.params;

        const item = await strapi.query("api::progress.progress").findOne({
            where: { id: id },
            populate: true
        })

        const response = {
            id: item.id,
            student_id: item.student.student_id,
            lecturer_id: item.lecturer.lecturer_id,
            lecturer_code: item.lecturer.lecturer_code,
            progress_note_id: item.progress_note.id,
            progress_value_id: item.progress_value.id,
            abstract: {
                value: item.progress_value.abstract,
                note: item.progress_note.abstract
            },
            chapter_one: {
                value: item.progress_value.chapter_one,
                note: item.progress_note.chapter_one
            },
            chapter_two: {
                value: item.progress_value.chapter_two,
                note: item.progress_note.chapter_two
            },
            chapter_three: {
                value: item.progress_value.chapter_three,
                note: item.progress_note.chapter_three
            },
            reference: {
                value: item.progress_value.reference,
                note: item.progress_note.reference
            },
            total: item.progress_value.total_score,
            created_at: item.createdAt,
            updated_at: item.updatedAt
        }

        return response;
    },
    
    async find(ctx){
        const { nip, nim } = ctx.request.body;

        const data = await strapi.query('api::progress.progress').findMany({
            populate: true
        });


        let progressCollection: IProgress[] = [];

        for (const item of data) {
            progressCollection.push({
                id: item.id,
                student_id: item.student.student_id,
                lecturer_id: item.lecturer.lecturer_id,
                lecturer_code: item.lecturer.lecturer_code,
                progress_note_id: item.progress_note.id,
                progress_value_id: item.progress_value.id,
                abstract: {
                    value: item.progress_value.abstract,
                    note: item.progress_note.abstract
                },
                chapter_one: {
                    value: item.progress_value.chapter_one,
                    note: item.progress_note.chapter_one
                },
                chapter_two: {
                    value: item.progress_value.chapter_two,
                    note: item.progress_note.chapter_two
                },
                chapter_three: {
                    value: item.progress_value.chapter_three,
                    note: item.progress_note.chapter_three
                },
                reference: {
                    value: item.progress_value.reference,
                    note: item.progress_note.reference
                },
                total: item.progress_value.total_score,
                created_at: item.createdAt,
                updated_at: item.updatedAt
            })
        }

        if(nip && nim){
            const response = progressCollection.filter((item)=> {
                if(item.lecturer_id == nip && item.student_id == nim){
                    return item;
                }
            })
            
            if(!response) {
                return ctx.notFound("There no data that match with your input");
            };

            return response
        }

        return progressCollection
    },
    async create(ctx){
        const { data } = ctx.request.body;


        const isStudentExist = await strapi.query('api::student.student').findOne({
            where: { id: data.student}
        })

        const isLecturerExist = await strapi.query('api::lecturer.lecturer').findOne({
            where: { id: data.lecturer}
        })

        if(!isStudentExist || !isLecturerExist){
            return ctx.badRequest("Student or Lecturer does not exist");
        }


        const entry = await strapi.query('api::progress.progress').create({
            data: {
                student: data.student,
                lecturer: data.lecturer
            }
        })

        await strapi.query('api::progress-note.progress-note').create({
            data: {
                progress: entry.id,
            }
        })

        await strapi.query('api::progress-value.progress-value').create({
            data: {
                progress: entry.id,
            }
        })

        return entry;
    },
    async update(ctx){
        const { id } = ctx.params;
        const { data } = ctx.request.body;

        const progress = await strapi.query("api::progress.progress").findOne({
            where: { id :id },
            populate: { progress_value: true, progress_note: true }
        })

        await strapi.query("api::progress-value.progress-value").update({
            where: { id: progress.progress_value.id },
            data: {
                abstract: data.progress_value.abstract,
                chapter_one: data.progress_value.chapter_one,
                chapter_two: data.progress_value.chapter_two,
                chapter_three: data.progress_value.chapter_three,
                reference: data.progress_value.reference,
                total_score: getAverage([
                    data.progress_value.abstract,
                    data.progress_value.chapter_one,
                    data.progress_value.chapter_two,
                    data.progress_value.chapter_three,
                    data.progress_value.reference
                ])
            }
        })

        await strapi.query("api::progress-note.progress-note").update({
            where: { id: progress.progress_note.id },
            data: {
                abstract: data.progress_note.abstract,
                chapter_one: data.progress_note.chapter_one,
                chapter_two: data.progress_note.chapter_two,
                chapter_three: data.progress_note.chapter_three,
                reference: data.progress_note.reference
            }
        })

        return ctx.body = {
            success: true,
            message: "updated"
        }
    }
}));
