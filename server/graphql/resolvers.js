
const {createConnection} = require("typeorm");
const {getManager} = require("typeorm");
const resolvers = {
    Query: {
        findSchool: (root, args, { School }) => {
            var array = [];
           
                const ESCOLA = new School();
                ESCOLA.name = "Timber";
                ESCOLA.age = 10
                ESCOLA.city = "hud"
                ESCOLA.country = "hudlindo"
                ESCOLA.photos = "photosss"
             createConnection.connection.manager.save(ESCOLA);
                console.log("Saved a new user with id: " + ESCOLA.id);
                const school = connection.manager.find(School);
                console.log("Loaded users: ", school);
          
                return school;
           
        },
        hello: (root, args, { School })  => {  
            const  postRepository =  getManager().getRepository(School);
            const escola= postRepository.find().then(resolve=>resolve);
        return escola
            
         },

        findCourses: (root, args, { Course }) => {
            return Course.find(args).then(courses => courses);
        },
        findIntensities: (root, args, { Intensity }) => {
            return Intensity.find(args).then(intensities => intensities);
        },
        getUser: (root, args, context) => {
            return context.User.find({ _id: context.userId }).then(user => user);
        }
    },
    Mutation: {
        addSchool: (root, args, { School }) => {
            const school = new School(args);
            return school.save().then(school => school);
        },
        deleteSchool: (root, args, { School }) => {
            return School.findByIdAndDelete(args._id).then(school => school)
        },
        deleteCourse: (root, args, { Course }) => {
            return Course.findByIdAndDelete(args._id).then(course => course)
        },
        deleteIntensity: (root, args, { Intensity }) => {
            return Intensity.findByIdAndDelete(args._id).then(intensity => intensity)
        },
        deleteShift: (root, args, { Shift }) => {
            return Shift.findByIdAndDelete(args._id).then(shift => shift)
        }
    },
    School: {
        courses: (root, args, { Course }) => {
            let query = {
                school: root._id
            }
            if (args.title) {
                query = { ...query, title: args.title }
            }
            return Course.find(query).then(courses => courses);
        },
        addCourses: (root, args, { Course }) => {
            courses = args.courses.map(course => {
                course.school = root._id;
                return course;
            })
            return Course.create(courses).then(courses => courses)
        }
    },
    Course: {
        intensities: (root, args, { Intensity }) => {
            return Intensity.find({ course: root._id }).then(intensities => intensities);
        },
        addIntensities: (root, args, { Intensity }) => {
            intensities = args.intensities.map(intensity => {
                intensity.school = root.school;
                intensity.course = root._id;
                return intensity;
            })
            return Intensity.create(intensities).then(intensities => intensities)
        }
    },
    Intensity: {
        shifts: (root, args, { Shift }) => {
            return Shift.find({ intensity: root._id }).then(shifts => shifts);
        },
        addShifts: (root, args, { Shift }) => {
            shifts = args.shifts.map(shift => {
                shift.school = root.school;
                shift.intensity = root._id;
                return shift;
            })
            return Shift.create(shifts).then(shifts => shifts)
        }
    },
    User: {
        info: (root, args, { UserInfo }) => {
            return UserInfo.findOne({ userId: root.id }).then(userInfo => userInfo);
        }
    }
}

module.exports = resolvers;
