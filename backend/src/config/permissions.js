module.exports = PERMISSIONS = {
    admin: {
        // Full system access
        users: {
            create: true,
            read: true,
            update: true,
            delete: true,
            changeRole: true
        },
        courses: {
            create: true,
            read: true,
            update: true,
            delete: true
        },
        documents: {
            create: true,
            read: true,
            update: true,
            delete: true
        },
        assignments: {
            create: true,
            read: true,
            update: true,
            delete: true,
            grade: true
        }
    },
    instructor: {
        users: {
            read: true
        },
        courses: {
            create: true,
            read: true,
            update: true,
            delete: true // Only for their own courses
        },
        documents: {
            create: true,
            read: true,
            update: true,
            delete: true // Only for their course documents
        },
        assignments: {
            create: true,
            read: true,
            update: true,
            delete: true, // Only for their course assignments
            grade: true
        }
    },
    student: {
        users: {
            read: true,
            updateProfile: true
        },
        courses: {
            read: true,
            enroll: true
        },
        documents: {
            read: true // Only for enrolled/accessible courses
        },
        assignments: {
            read: true,
            submit: true
        }
    }
};