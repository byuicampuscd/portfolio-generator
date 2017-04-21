/*eslint-env node*/
/*eslint no-console:0*/

//include d3-dsv for reading files
var d3Dsv = require('d3-dsv');
var fs = require('fs');

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
    this.ticketCount = tickets;
    this.currentCapacity = 0;
    this.maxCapacity = 0;
    this.teachers = [];    
}

//Course class
var Course = function Course(name, teacher, sections, department /*optional*/ ) {   
    this.name = name;
    if (department) this.department = department;
    this.teacher = teacher;
    this.sections = sections;
    this.assignedStudent = 0;
    this.tickets = 0; 
    this.assigned = false;
}

//Teacher class
var Teacher = function Teacher(name, assignedStudent) {
    this.name = name;
    this.assignedStudent = assignedStudent;
    this.courses = [];
    this.weight = 0; 
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
        if (students[i].currentTimeWeight < students[i].lastTimeWeight) {
            students[i].maxCapacity = students[i].tickets / 2;
        } else if (students[i].currentTimeWeight > students[i].lastTimeWeight) {
            students[i].maxCapacity = students[i].tickets * 2;
        } else {
            students[i].maxCapacity = students[i].tickets;
        }
    }

    //determines teacher weights
    for (i = 0; i < teachers.length; i++) {
        for (var j = 0; j < (teachers[i]).courses.length; j++) {
            teachers[i].weight += (teachers[i].courses[j].sections * teachers[i].courses[j].tickets);

        }
    }
    
     for (i = 0; i < teachers.length; i++) {
        console.log(teachers[i]);
     }
    
}

/*********************************************************
* name: makeTeachers
* desc: Technically makeStudents starts making the teachers 
*       and this function finishes. Makes functioning 
*       teacher objects array.
*********************************************************/
function trimOffExcess() {
    //give students teachers
    for (var i = 0; i < students.length; i++) {
        for(var j = 0; j < teachers.length; j++) {
            if (students[i].name === teachers[j].assignedStudent) {
                students[i].teachers.push(teachers[j]);
                teachers.splice(j, 1);
                j--;
            }
        }
    }
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