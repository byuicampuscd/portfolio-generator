var option = {
    tickets: 5
}
var studentData = {};
var courseData = {};

function generatePortfolio(students, courses) {
    //ranks the students and courses
    var student_capacity;
    var ca = 0;
    for (var i in courses) {
        ca += courses[i].getScore({
            section: sectionsQuartile
            , ticket: ticketsQuartile
        });
        if (!courseData[`${courses[i].department}`]) courseData[`${courses[i].department}`] = {
            score: 0
            , courses: []
        };
        courseData[`${courses[i].department}`].courses.push(courses[i]);
    }
    var sa = 0;
    for (var i in students) {
        sa += students[i].getCapacity(studentsQuartile);
        if (!studentData[`${students[i].getCapacity(studentsQuartile)}`]) studentData[`${students[i].getCapacity(studentsQuartile)}`] = [];
        studentData[`${students[i].getCapacity(studentsQuartile)}`].push(students[i]);
    }
    var student_capacity = Math.ceil(ca / sa) + 2;
    for (var i in courseData) {
        if (i == "undefined") {
            delete courseData[i];
        }
        else {
            scoreDepartment(courseData[i]);
        }
    }
    var student_length = 0;
    for (var i in studentData) student_length += studentData[i].length;
    console.log(student_length);
    console.log(courseData, studentData);
    sort3(courseData, student_capacity, studentData, student_length);
    /*
    courseData  = sort2(courseData, student_capacity);
   // sortCourseData(student_capacity);

    assignCourses(student_capacity);
    */
    for (var i in studentData) sortStudents(studentData[i]);
    console.log(studentData, courseData);
    var rend = new Renderer(studentData);
    console.log("Results", studentData, courseData);
    // */
    studentData = JSON.parse(JSON.stringify(studentData).replace(/(!|@|\*|\$|\/)/g,""));
    rend.sortManual(studentData, 4, (groups) => {
        var files = []
        var csv_docs = (rend.groupsToCSV(groups));
        var writer = new CSV_Writer();
        for (var i in csv_docs) {
            console.log("wasup");
            writer.writeFile(i, csv_docs[i], (link) => {
                console.log("Wasup");
                files.push(link);
                console.log(link);
            });
        }
        console.log(courseData);
        /*var left_over = "";
        for (var i in courseData) {
            for (var j in courseData[i]) {
                left_over += j + "\n";
                for (var a in courseData[i][j].courses) {
                    var cc = courseData[i][j].courses[a];
                    left_over += `${cc.name},${cc.department},${cc.department},${cc.course_lead},${cc.score}\n`;
                }
            }
            left_over += "\n";
        }
        writer.writeFile("unassigned_groups", left_over, (link) => {
            files.push(link);
        });*/
        window.setTimeout(() => {
            console.log(files);
            var dwn = document.getElementById("downloader");
            for (var a in files) {
                dwn.href = files[a];
                dwn.click();
            }
        }, 50);

        var checked = document.querySelector("#CSVcheck").checked;

        if (checked === true) displayer(groups);

        database.ref('portfolio/data').set(groups);
    });
}

function sort3(course_data, student_capacity, studentData, students) {
    var pool = [];
    var used = {};
    // displayer(groups);
    function sumCourses(courses) {
        var i = 0;
        for (var a in courses) i += courses[a].score;
        return i;
    }

    function splitCourse(courses) {}

    function inScope(data, start, range, department) {
        var cap = (range > data.length) ? data.length : range;
        for (var i = start; i < cap; i++) {
            //console.log("Data:"+data[i].name);
            if (data[i].department == department) return true;
        }
        return false;
    }

    function getCluster(pool, studentCapacity, cps) {
        var courses = [];
        var currentLead = pool[0].course_lead;
        var inuse = {};
        var score = 0;
        for (var i in pool) {
            var cc = pool[i];
            if (!(cc.department in inuse)) {
                inuse[cc.department] = true
                used[cc.department] = (used[cc.department] + 1, 0);
            }
            cc.group_name = `${cc.department} (${String.fromCharCode(65+used[cc.department])})`;
            if (parseInt(i) + 1 < pool.length) {
                if (pool[parseInt(i) + 1].department == cc.department && score >= studentCapacity - 2) {
                    console.log("END THIS");
                    pool.splice(0, parseInt(i));
                    return courses;
                }
            }
            else {
                console.log("END THIS");
                pool.splice(0, parseInt(i));
                return courses;
            }
            console.log(pool[i]);
            courses.push(pool[i]);
            score += cc.score;
            console.log(score);
            if (cc.course_lead != currentLead && cc.course_lead != pool[parseInt(i) + 1].course_lead) {
                //                /console.log("SPLIT!");
                if (sumCourses(courses) >= studentCapacity) {
                    if (!(inScope(pool, parseInt(i) + 1, 3, cc.department) && !inScope(pool, parseInt(i) + 4, 3, cc.department)) || courses.length >= cps) {
                        pool.splice(0, parseInt(i) + 1);
                        return courses;
                    }
                }
            }
        }
    }

    function sortToGroups(courses) {
        var groups = {};
        for (var i in courses) {
            groups[courses[i].group_name] = [];
        }
        for (var i in courses) {
            groups[courses[i].group_name].push(courses[i]);
        }
        return groups;
    }
    for (var i in course_data)
        for (var j in course_data[i].courses) pool.push(course_data[i].courses[j]);
    console.log(pool);
    var cps = (pool.length / students) - 2;
    console.log(students);
    var indexes = ["0.5", "1", "1.5", "2"];
    for (var i in indexes) {
        for (var j in studentData[indexes[i]]) {
            studentData[indexes[i]][j].courses = sortToGroups(getCluster(pool, (studentData[indexes[i]][j].getCapacity()) * student_capacity, (studentData[indexes[i]][j].getCapacity()) * cps));
            for (var x in studentData[indexes[i]][j].courses) {
                for(var y in studentData[indexes[i]][j].courses[x])
                studentData[indexes[i]][j].load += studentData[indexes[i]][j].courses[x][y].score;
            }
        }
    }
    //var indexes = getIndexes(studentData);
    console.log(studentData, pool);
}
/*
 * GARBAGE!!!!
 */
function sortStudents(students) {
    var courses = students;
    courses.sort((a, b) => {
        if (a.load > b.load) return 1;
        else if (a.load < b.load);
        return -1;
        return 0;
    });
    var capacity = students;
    capacity.sort((a, b) => {
        if (a.tickets > b.tickets) return 1;
        else if (a.tickets < b.tickets) return -1;
        return 0;
    });
    for (var i in courses) {
        capacity[i].courses = courses[i].courses;
    }
    students = capacity;
}

function scoreDepartment(department) {
    var score = 0;
    for (var i in department.courses) score += department.courses[i].score;
    department.score = score;
}

function assignCourses(student_capacity) {
    var courseIndexes = getIndexes(courseData);
    courseIndexes.sort(function (a, b) {
        var c = parseFloat(a);
        var d = parseFloat(b);
        if (c < d) return -1;
        else if (c > d) return 1;
        return 0;
    });
    for (var i in courseIndexes) {
        for (var j in courseData[courseIndexes[i]]) {
            if (insertCourse(j, courseData[courseIndexes[i]][j], student_capacity)) {
                delete courseData[courseIndexes[i]][j];
                if (sizeOf(courseData[courseIndexes[i]]) <= 0) delete courseData[courseIndexes[i]];
            }
            else {
                var data = splitCourses(courseData[courseIndexes[i]][j].courses);
                for (var x in data) insertCourse(x, data[x], student_capacity);
            }
        }
    }
    //    if(sizeOf(courseData) > 0){
    //
    //        assignCourses(student_capacity*1.5);
    //        //courseData = s;
    //    }
    //console.log(totalCourses, totalStudents);
}

function splitCourses(courses) {
    //console.log(courses);
    if (!courses) return {};
    var split = Math.round(courses.length / 2);
    var to = 0;
    //console.log(split - 1, split);
    var found = true;
    while (courses[split].course_lead == courses[split - 1].course_lead && to < 1000) {
        if (split != 1) split--;
        else split = courses.length - 1;
        to++;
        //        console.log(to, split - 1, split);
        if (to > 999) {
            found = false;
            console.warn("Loop exceeded maximium runtime");
        }
    }
    var department = courses[0].department;
    var nc = {};
    if (!found) {
        nc[department] = {};
        nc[department].courses = courses;
        scoreDepartment(nc[department]);
        return nc;
    }
    if (!courses[0].groupname) {
        nc[`${department} (A)`] = {};
        nc[`${department} (A)`].courses = courses.slice(0, split);
        var score = 0;
        for (var i in nc[`${department} (A)`].courses) {
            nc[`${department} (A)`].courses[i].groupname = `${department} (A)`;
            score += nc[`${department} (A)`].courses[i].score;
            //console.log(nc[`${department} (A)`].courses[i].score)
        }
        nc[`${department} (A)`].score = score;
        //console.log(nc[`${department} (A)`].score)
        score = 0;
        nc[`${department} (B)`] = {}
        nc[`${department} (B)`].courses = courses.slice(split, courses.length);
        for (var i in nc[`${department} (B)`].courses) {
            nc[`${department} (B)`].courses[i].groupname = `${department} (B)`;
            score += nc[`${department} (B)`].courses[i].score;
        }
        nc[`${department} (B)`].score = score;
        score = 0;
    }
    else {
        var Letter = (courses[0].groupname.match(/[(].[)]/g));
        var ascii = (Letter[0].replace(/[(]|[)]/g, "").charCodeAt(0));
        ascii += 1;
        nc[courses[0].groupname] = {};
        nc[courses[0].groupname].courses = courses.slice(0, split);
        var score = 0;
        for (var i in nc[courses[0].groupname].courses) {
            nc[courses[0].groupname].courses[i].groupname = courses[0].groupname;
            score += nc[courses[0].groupname].courses[i].score;
            //console.log(nc[courses[0].groupname].courses[i].score)
        }
        nc[courses[0].groupname].score = score;
        //console.log(nc[courses[0].groupname].score)
        score = 0;
        nc[`${department} (${String.fromCharCode(ascii)})`] = {}
        nc[`${department} (${String.fromCharCode(ascii)})`].courses = courses.slice(split, courses.length);
        for (var i in nc[`${department} (${String.fromCharCode(ascii)})`].courses) {
            nc[`${department} (${String.fromCharCode(ascii)})`].courses[i].groupname = `${department} (${String.fromCharCode(ascii)})`;
            score += nc[`${department} (${String.fromCharCode(ascii)})`].courses[i].score;
        }
        nc[`${department} (${String.fromCharCode(ascii)})`].score = score;
        score = 0;
    }
    //console.log(nc);
    return (nc);
}

function getTotalCourses() {
    var totalCourses = 0;
    for (var i in courseData)
        for (var j in courseData[i]) {
            totalCourses++;
        }
    return totalCourses;
}

function getTotalStudents() {
    var totalStudents = 0;
    for (var i in studentData) totalStudents += studentData[i].length;
    return totalStudents;
}

function insertCourse(name, course, student_capacity) {
    console.log(name, course)
    var indexes = getIndexes(studentData);
    indexes.sort((a, b) => {
        var c = parseFloat(a);
        var d = parseFloat(b);
        if (c < d) return -1;
        else if (c > d) return 1;
        return 0;
    });
    var found = false;
    var t = 0;
    while (!found && t < 1000) {
        for (var i in indexes)
            if (found) break;
            else {
                studentData[indexes[i]].sort((a, b) => {
                    if (a.ticket_count > b.ticket_count) return 1;
                    else if (b.ticket_count > a.ticket_count) return -1;
                    return 0;
                });
                for (var j in studentData[indexes[i]]) {
                    var student = studentData[indexes[i]][j];
                    var maxCapacity = ((student_capacity) * student.getCapacity());
                    if (course.hopeless && maxCapacity < student_capacity) maxCapacity = student_capacity;
                    if (course.score <= maxCapacity - student.load) {
                        student.addDepartment(course, name);
                        found = true;
                        break;
                    }
                }
            }
        t++;
        if (t > 999) {
            console.warn("This course is hopeless!");
            var c = splitCourses(course.courses);
            for (var i in c) {
                console.log("Splitting Course\n", name)
                c[i].hopeless = true;
                console.log(c[i].score);
                insertCourse(i, c[i], student_capacity);
                return true;
            }
        }
    }
    if (found && course.hopeless) console.log("THERE IS HOPE!\n", name);
    return found;
}

function grabCourse(capacity) {}

function sort2(course_data, student_capacity) {
    var temp = {};
    for (var i in course_data) {
        if (course_data[i].score > student_capacity / 2) {
            var groups = splitCourses(course_data[i].courses)
            for (var a in groups) {
                temp[a] = groups[a];
            }
        }
        else temp[i] = course_data[i];
    }
    var courseLoads = [2, 1.5, 1, 0.5];
    var newCourseData = {};
    for (var i in courseLoads) {
        for (var j in temp)
            if (temp[j].score > student_capacity * courseLoads[i]) {
                if (!newCourseData[courseLoads[i]]) {
                    newCourseData[courseLoads[i]] = {}
                };
                newCourseData[courseLoads[i]][j] = temp[j];
                //newCourseData[courseLoads[i]].length++;
                delete temp[j];
            }
    }
    //console.log(newCourseData);
    return newCourseData;
}

function sortCourseData(student_capacity) {
    var last;
    for (var i in courseData) {
        var score = 0;
        var split = false;
        var current = 0;
        var tab;
        if (i != "undefined")
            for (var j in courseData[i].courses) {
                if (!last) last = j;
                var append = " (" + String.fromCharCode(65 + current) + ")";
                score += courseData[i].courses[j].getScore();
                if (split) {
                    if (!(courseData[i + append])) {
                        courseData[i + append] = {
                            score: 0
                            , courses: []
                        };
                    }
                    courseData[i + append].courses.push(courseData[i].courses[j]);
                    //courseData[i].courses.splice(courseData[i].courses.indexOf(courseData[i].courses[j],1));
                }
                // console.log(i, courseData[i].courses[last], last);
                if (score > student_capacity / 2 && !split && courseData[i].courses[last].course_lead != courseData[i].courses[j].course_lead) {
                    if (!(courseData[i].courses.length - parseInt(j) < student_capacity * .5)) {
                        courseData[i].score = score;
                        split = true;
                        score = 0;
                        current++;
                        tab = j;
                    }
                }
                last = j;
            }
        if (!split) courseData[i].score = score;
        else {
            courseData[i + append].score = score;
            append = " (" + String.fromCharCode(65) + ")";
            courseData[i + append] = {
                score: 0
                , courses: []
            }
            courseData[i + append].score = courseData[i].score;
            for (var a = 0; a < tab; a++) {
                courseData[i + append].courses.push(courseData[i].courses[a]);
            }
            delete courseData[i];
        }
    }
    var data = {};
    var courseLoads = [2, 1.5, 1, .5];
    for (var i in courseLoads) {
        data[courseLoads[i]] = {};
        //console.log("Data: ", data);
        for (var j in courseData) {
            if (j != "undefined") {
                if (courseData[j].score >= student_capacity * courseLoads[i]) {
                    data[courseLoads[parseInt(i)]][j] = (courseData[j]);
                    delete courseData[j];
                }
            }
        }
    }
    courseData = data;
    //console.log("COURSE DATA", student_capacity);
}

function sizeOf(object) {
    var size = 0;
    for (var i in object) size++;
    return size;
}

function getIndexes(object) {
    var index = [];
    for (var i in object) index.push(i)
    return index;
}
/* 67132
 * /Course Files/Course Schedule.html
 * /
 */
