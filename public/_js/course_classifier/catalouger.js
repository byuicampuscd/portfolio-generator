// These are the global variables used for sorting and displaying the student data
var studentData = {};
var courseData = {};
/*
 * This takes the raw csv object data and then categorizes it
 * Once the data has been categorized, it writes it to a csv file
 */
function generatePortfolio(students, courses) {
    var student_capacity;
    var ca = 0;
    //sorts courses by department and takes out invalid characters
    for (var i in courses) {
        if (courses[i].department) courses[i].department = courses[i].department.replace(/\./g, "");
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
    // sorts students by their capacity
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
    // gets amount of students
    var student_length = 0;
    for (var i in studentData) student_length += studentData[i].length;
    // assigns courses to students
    sort3(courseData, student_capacity, studentData, student_length);
    console.log(studentData, courseData);
    //gives the higher caliber courses to the more experienced students
    for (var i in studentData) sortStudents(studentData[i]);
    //setup for csv export
    var rend = new Renderer(studentData);
    studentData = JSON.parse(JSON.stringify(studentData).replace(/(!|@|\*|\$|\/)/g, ""));
    //writes data to csv file
    rend.sortManual(studentData, 4, (groups) => {
        var files = []
        var w = new CSV_Writer();
        var jsonData = JSON.stringify(groups);
        console.log(jsonData);
        w.writeJOSNFile("Groups",jsonData, (link)=>{
            var dwn = document.getElementById("downloader");
                dwn.href = link;
                dwn.click();

        });
        var csv_docs = (rend.groupsToCSV(groups));
         console.log(csv_docs);
         sendToGoogleDrive(csv_docs,1);

        /*
        var writer = new CSV_Writer();
        for (var i in csv_docs) {
            writer.writeFile(i, csv_docs[i], (link) => {
                files.push(link);
            });
        }
        // downloads files when write completed
        window.setTimeout(() => {
            console.log(files);
            var dwn = document.getElementById("downloader");
            for (var a in files) {
                dwn.href = files[a];
                dwn.click();
            }
        }, 50);

        for (var i in groups) {
            var group = groups[i];
            for (var j in group) {
                var student = group[j];
                if (Object.keys(student).length === 0) {
                    student.isLead = true;
                };
            }
        }*/
        //database.ref('portfolio/data').set(groups);
    });
}
var doc_id = "";

function sendToGoogleDrive(csv_docs, index) {
    console.log("Next",index);
    console.log("loop");
    var indexes = getIndexes(csv_docs);
    var i = indexes[index];
    var cd = {};
    cd[i] = csv_docs[i];
    console.log((cd), doc_id);
    $.get("https://script.google.com/macros/s/AKfycbyJYtLmxGIj3jLwK95u7o0AydZATkHMkmkOv0n4AnEfHVz8-EjK/exec", {
        name: "Portfolios"
        , data: JSON.stringify(cd)
        , id: doc_id
    }, function (e) {
        console.log(e);
        doc_id = e.id;
        console.log(doc_id);
        var next = index+1;
        if(next < sizeOf(csv_docs) && next > 1){
            window.setTimeout(()=>{sendToGoogleDrive(csv_docs, next)}, 50);
        }else if(next >= sizeOf(csv_docs)){
            window.setTimeout(()=>{sendToGoogleDrive(csv_docs, 0)}, 50);
        }else{
            displayLink(e.url);
        }
    });
}

function displayLink(url){
   console.log(url);
}

/*
 * This assignes courses to students based of of their capacity and the max amount of courses that can be assigned to a student
 */
function sort3(course_data, student_capacity, studentData, students) {
    var pool = [];
    var used = {};
    // gets total score of course cluster
    function sumCourses(courses) {
        var i = 0;
        for (var a in courses) i += courses[a].score;
        return i;
    }
    // detects if a course is in a specified range within the array
    function inScope(data, start, range, department) {
        var cap = (range > data.length) ? data.length : range;
        for (var i = start; i < cap; i++) {
            if (data[i].department == department) return true;
        }
        return false;
    }
    // assigns a course cluster to the student
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
                    pool.splice(0, parseInt(i));
                    return courses;
                }
            }
            else {
                pool.splice(0, parseInt(i));
                return courses;
            }
            courses.push(pool[i]);
            score += cc.score;
            if (cc.course_lead != currentLead && cc.course_lead != pool[parseInt(i) + 1].course_lead) {
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
    var cps = (pool.length / students) - 2;
    var indexes = ["0.5", "1", "1.5", "2"];
    for (var i in indexes) {
        for (var j in studentData[indexes[i]]) {
            studentData[indexes[i]][j].courses = sortToGroups(getCluster(pool, (studentData[indexes[i]][j].getCapacity()) * student_capacity, (studentData[indexes[i]][j].getCapacity()) * cps));
            for (var x in studentData[indexes[i]][j].courses) {
                for (var y in studentData[indexes[i]][j].courses[x]) studentData[indexes[i]][j].load += studentData[indexes[i]][j].courses[x][y].score;
            }
        }
    }
}

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
