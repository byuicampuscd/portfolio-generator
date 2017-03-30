/*eslint-env node*/
/*eslint no-console:0*/
    
//include d3-dsv for reading files
var d3Dsv = require('d3-dsv');
var fs = require('fs');

//global students
var students = 0;
var courseRankCSV = 0;
var courseInfoCSV = 0;
var lastSemesterCSV = 0;

/*********************************************************
* name: read
* desc: Reads the CSV's using d3-dsv. Makes objects arrays
*       with CSV info. Read d3-dsv for more info.
*********************************************************/
function read() {
    studentContents = fs.readFileSync('\Test_CSV/\/Student Rank (Sept 30).csv').toString();
    courseRankContents = fs.readFileSync('\Test_CSV/\/Course Rank.csv').toString();
    courseInfoContents = fs.readFileSync('\Test_CSV/\/Course Variant List.csv').toString();

    //start of student object array
    /*students = d3Dsv.csvParse(studentContents, function(data) {
        return new Student(data.PrimResp, data.FullTimeWeight, data.TicketCount);
    });*/
    
    //makes the rest of the CSV's file object arrays
    /*courseInfoCSV = d3Dsv.csvParse(courseInfoContents, function(data) {
        return new Course(data.Course, data.Email, data.Sections, data.Department_Name);
    });*/
    
    courseRankCSV = d3Dsv.csvParse(courseRankContents);
  
    //var lastSemesterCSV = d3Dsv.cvsParse();
    
    console.log(courseRankCSV);
    console.log(courseInfoCSV);
}

/*********************************************************
* name: updateCourseInfo
* desc: Updates courses on oldCsv with currentCourse CSV 
*       then assigns it to student object array.
* input: 
*       oldStudentCSV: object array
*       currentCoursesCSV: object array
*       students: student object array
* output: updated students
**********************************************************/
function updateCourseInfo() {
    //go through old students courses
    //find matching courses on course list
    //add matching course list to temp course list
    //go through temp course list and make teachers
    //find matching new student and add teachers to new student
}

/*********************************************************
* name: doMath
* desc: Determines the capacities of the students and the
*       weights of the teachers.
*********************************************************/
function doMath() {
//won't need it's own file for now
    //determine overall//average capacity and weight info
    
    //loop calling students getCapacity function
    
    //loop calling students teachers getWeightFunction
    
    //loop calling teachers getWeight function
}

/*********************************************************
* name: makeTeachers
* desc: Technically makeStudents starts making the teachers 
*       and this function finishes. Makes functioning 
*       teacher objects array.
*********************************************************/
function makeTeachers() {
    
}

/*********************************************************
* name: assign
* desc: Assigns remaining teachers to the remaining students.
*       Makes teams somehow.
*********************************************************/
function assign() {
    
}

/*********************************************************
* name: write
* desc: Uses the students array and or teams to make CSV's
*********************************************************/
function write() {
    
}

read();