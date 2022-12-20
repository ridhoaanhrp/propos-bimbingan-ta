/**
 * lecturer controller
 */

import { factories } from '@strapi/strapi'

interface ILecturer {
    id: Number,
    lecturer_id: String,
    lecturer_code: String,
    name: String,
    created_at: Date,
    updated_at: Date,
    students: IStudent[]
}

interface IStudent {
    id: Number,
    name: String,
    student_id: String,
    title: String,
    advisors: String[]
}

export default factories.createCoreController('api::lecturer.lecturer', ({strapi}) => ({
    async findOne(ctx){
        const { id } = ctx.params;

        const data = await strapi.query('api::lecturer.lecturer').findOne({
            where: { $or: [ { lecturer_id: id }, {lecturer_code: id} ] },
            populate: { students: false }
        })


        if(!data) {
            return ctx.notFound("NIP or Lecturer Code not found", { 
                message: "Input yang dimasukan tidak ditemukan dalam database"
            });
        }

        let studentCollection: IStudent[] = [];

        for(const item of data.students){
            const student = await strapi.query('api::student.student').findOne({
                where: { student_id: item.student_id },
                populate: { advisors: true }
            });

            const advisors: String[] = student.advisors.map((item) => { return item.lecturer_code });

            studentCollection.push({
                id: item.id,
                name: item.name,
                student_id: item.student_id,
                title: item.title,
                advisors: advisors
            })
        }


        const response: ILecturer = {
            id: data.id,
            lecturer_id: data.lecturer_id,
            lecturer_code: data.lecturer_code,
            name: data.name,
            created_at: data.createdAt,
            updated_at: data.updatedAt,
            students: studentCollection
        }
        console.log(response);

        return response;

    },
    async find(ctx){

        const data = await strapi.query('api::lecturer.lecturer').findMany({
            populate: { students: true }
        })


        const studentList = await strapi.query('api::student.student').findMany({
            populate: { advisor: true }
        })

        let lecturerCollection: ILecturer[] = [];

        for(const lecturer of data){
            let studentCollection: IStudent[] = [];
            for(const item of lecturer.students){
                const student = await strapi.query('api::student.student').findOne({
                    where: { student_id: item.student_id },
                    populate: { advisors: true }
                });

                const advisors: String[] = student.advisors.map((item) => { return item.lecturer_code });

                studentCollection.push({
                    id: item.id,
                    name: item.name,
                    student_id: item.student_id,
                    title: item.title,
                    advisors: advisors
                })
            }

            lecturerCollection.push({
                id: lecturer.id,
                lecturer_id: lecturer.lecturer_id,
                lecturer_code: lecturer.lecturer_code,
                name: lecturer.name,
                created_at: lecturer.createdAt,
                updated_at: lecturer.updatedAt,
                students: studentCollection
            })
        }
            
        return lecturerCollection;

    }
}));
