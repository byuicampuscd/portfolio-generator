/*eslint-env node*/
/*eslint no-console:0*/

//include d3-dsv for reading files
var d3Dsv = require('d3-dsv');
var fs = require('fs');

//global variables - user chooses values
var allowance = 2;
var ratio = 0.16;

//global variables
var students = 0;
var teachers =[];
var courseRank = 0;
var courses = 0;
var oldCourses = 0;


    
//Student class
var Student = function Student(name, lastWeight, currentWeight, tickets) {
    this.name = name;
    this.lastTimeWeight = lastWeight;
    this.currentTimeWeight = currentWeight;
    this.tickets = tickets;
    this.currentCapacity = 0;
    this.maxCapacity = 0;
    this.teachers = [];    
}

Student.prototype.addTeacher = function(teacher) {
    this.teachers.push(teacher);
    this.currentCapacity += teacher.weight;
}

Student.prototype.calcRatio = function() {
    var ratio = 0;
    if (this.currentCapacity !== 0) {
        ratio = this.maxCapacity/this.currentCapacity;
    }
    return ratio;
}

Student.prototype.calcCapacity = function() {
    if (this.currentTimeWeight < this.lastTimeWeight) {
        this.maxCapacity = this.tickets / 2;
    } else if (this.currentTimeWeight > this.lastTimeWeight) {
        this.maxCapacity = this.tickets * 2;
    } else {
        this.maxCapacity = this.tickets;
    }
}

Student.prototype.getCapDif = function() {
    return this.currentCapacity - this.maxCapacity;
}

Student.prototype.removeExcess = function() {
    //console.log("is this working");
    
    //console.log(this.teachers.length);
    for (var i = 0; i < this.teachers.length; i++) {
        console.log(this.teachers[i].weight);
        if (this.getCapDif() > (this.teachers[i].weight)) {
            teachers.push(this.teachers[i]);
            this.teachers.splice(i, 1);
            console.log(this.teachers[i].weight);
        }
    }
}

//Course class
var Course = function Course(name, teacher, sections, department /*optional*/ ) {   
    this.name = name;
    if (department) this.department = department;
    this.teacher = teacher;
    this.sections = sections;
    this.assignedStudent = 0;
    this.tickets = 1; 
    this.assigned = false;
}

//Teacher class
var Teacher = function Teacher(name, assignedStudent) {
    this.name = name;
    this.assignedStudent = assignedStudent;
    this.courses = [];
    this.weight = 0; 
}

Teacher.prototype.calcWeight = function() { 
    for (var j = 0; j < this.courses.length; j++) {
        this.weight += (this.courses[j].sections * this.courses[j].tickets);
    }
    //this.weight *= ratio;
}

/*********************************************************
* name: makeStudentsAndCourses
* desc: Reads the CSV's using d3-dsv. Makes object arrays
*       with CSV info. Read d3-dsv for more info. Also 
*       updates courses to have its needed data
*********************************************************/
function makeStudentsAndCourses() {
    //read files
    var studentContents = fs.readFileSync('\Test_CSV/\/Student Rank (Sept 30).csv').toString();
    var courseRankContents = fs.readFileSync('\Test_CSV/\/Course Rank.csv').toString();
    var courseInfoContents = fs.readFileSync('\Test_CSV/\/Course Variant List.csv').toString();
    var lastSemester = fs.readFileSync('\Test_CSV/\/lastSemester.csv').toString();

    //start student object array
    students = d3Dsv.csvParse(studentContents, function(data) {
        return new Student(data.PrimResp, data.LastWeight, data.CurrentWeight, data.TicketCount);
    });
    
    //start course object array
    courses = d3Dsv.csvParse(courseInfoContents, function(data) {
        return new Course(data.Course, data.Email, data.Sections, data.Department_Name);
    });
    
    //make remaining csv's into object arrays
    courseRank = d3Dsv.csvParse(courseRankContents);
    oldCourses = d3Dsv.csvParse(lastSemester);  
    
    //update course objects so that they have a ticket number and an assigned student
    for (var i = 0; i < courses.length; i++) {
        for (var j = 0; j < courseRank.length; j++) {
            if (courses[i].name === courseRank[j].Course) {
                courses[i].tickets = courseRank[j].Ticket_Count;
            }
        }
        for (var k = 0; k < oldCourses.length; k++) {
            if (courses[i].name === oldCourses[k].Course) {
                courses[i].assignedStudent = oldCourses[k].Student;
            }
        }
    }
}

/*********************************************************
* name: makeTeachers
* desc: Combines courses together into the corresponding new
*       teacher objects.
* input: 
*       oldStudentCSV: object array
*       currentCoursesCSV: object array
*       students: student object array
* output: updated students
**********************************************************/
function makeTeachers() {
    
    //make array of teacher names including broken teachers
    var teacherList = [];
    var add = true;
    for (var i = 0; i < courses.length; i++) {
        add = true;
        for (var j = i + 1; j < courses.length; j++) {
            if (courses[i].teacher === courses[j].teacher && 
                courses[i].assignedStudent === courses[j].assignedStudent) {
                add = false;
            }
        }
        if (add) {
            teacherList.push({"teacher": courses[i].teacher, "student": courses[i].assignedStudent});
        }
    }
    
    //make teacher object array
    var tempTeacher = 0;
    for(i = 0; i < teacherList.length; i++) {
        tempTeacher = new Teacher(teacherList[i].teacher, teacherList[i].student);
        for(j = 0; j < courses.length; j++) {
            if(teacherList[i].teacher === courses[j].teacher && 
                teacherList[i].student === courses[j].assignedStudent) {
                tempTeacher.courses.push(courses[j]);
            }
        }
        teachers.push(tempTeacher);
    }
}

/*********************************************************
* name: doMath
* desc: Determines the capacities of the students and the
*       weights of the teachers.
*********************************************************/
function doMath() {
    
    //determine student capacity
    for (var i = 0; i < students.length; i++) {
        students[i].calcCapacity();
    }

    //determines teacher weights
    for (i = 0; i < teachers.length; i++) {
        teachers[i].calcWeight();
    }
    
    //console.log(teachers.length / students.length);
}

//average ratio
function calculateAvgRatio() {
    var allRatios = 0;
    var length = students.length;
    for (var i = 0; i < students.length; i++) {
        if (students[i].calcRatio() === 0) {
            length -= 1;
        } else if (students[i].calcRatio() > 0) {
            allRatios += students[i].calcRatio();
        } else {
            console.log("bad things are happening");
            console.log(students[i].calcRatio());
            console.log(i);
        }
    }
    console.log(allRatios/length);
    console.log(students[5]);
}

/*********************************************************
* name: trimOffExcess
* desc: Technically makeStudents starts making the teachers 
*       and this function finishes. Makes functioning 
*       teacher objects array.
*********************************************************/
function trimOffExcess() {
    teachers.sort(function (a, b) {
        return b.weight - a.weight;
    });
    
    //give students last semester teachers
    for (var i = 0; i < students.length; i++) {
        for (var j = 0; j < teachers.length; j++) {
            if (students[i].name === teachers[j].assignedStudent) {
                students[i].addTeacher(teachers[j]);
                teachers.splice(j, 1);
                j--;
            }
        }
    }
    
    for (i = 0; i < students.length; i++) {
        if (students[i].teachers.length && (students[i].getCapDif() > allowance)) {
            students[i].removeExcess();
        }
    }
    
    /*for (i = 0; i < students.length; i++) {  
        for (j = 0; j < students[i].teachers.length; j++) {
            console.log(students[i].teachers[j].weight);
        }
    }*/
}

/*********************************************************
* name: assign
* desc: Assigns remaining teachers to the remaining students.
*       Makes teams somehow.
*********************************************************/
function assignRemaining() {
    
}

/*********************************************************
* name: write
* desc: Uses the students array and or teams to make CSV's
*********************************************************/
function write() {
    
}

makeStudentsAndCourses();
makeTeachers();
doMath();
trimOffExcess();
//calculateAvgRatio();