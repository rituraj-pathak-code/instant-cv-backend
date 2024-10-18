import mongoose, { Schema } from 'mongoose'


const resumeSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String },
        leetcode: { type: String }
    },
    education: [
        {
            degree: { type: String, required: true },
            institute: { type: String, required: true },
            start_date: { type: String, required: true },
            end_date: { type: String, required: true }
        }
    ],
    experience: [
        {
            company: { type: String, required: true },
            role: { type: String, required: true },
            start_date: { type: String, required: true },
            end_date: { type: String },
            description: { type: [String], required: true }
        }
    ],
    projects: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            link: { type: String }
        }
    ],
    skills: [
        {
            skill_type: { type: String, required: true },
            skills: { type: [String], required: true }
        }
    ],
    image: { type: String, required: true },
    templateId: {type: String, required: true }
}, { timestamps: true });

const Resume = mongoose.model('Resume',resumeSchema);

export default Resume;
