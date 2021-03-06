/*************************************************************
* Student class
*************************************************************/
var Student = function Student(name, full_time_weight, ticket_count){
    this.name = name;
    this.full_time_weight = full_time_weight;
    this.ticket_count = ticket_count;
    this.load = 0;
}

/************************************************************
* name: getCapacity
* desc: If capacity is undefined return a new capacity value
*       otherwise determine and return capacity.
* inputs: 
*       student_quartile: quartile object?
* outputs: student objects capacity
************************************************************/
Student.prototype.getCapacity = function (student_quartile) {
    if (!this.capacity) {

        function roundToTens(number) {
            return Math.ceil(number / 10) * 10;
        }
        var capacity = 1;

        if (this.full_time_weight >= 2) return 2;
        if (this.ticket_count <= roundToTens(student_quartile.getFirstQuartile())) {
            capacity = .5;
        }
        else if (this.ticket_count >= roundToTens(student_quartile.getThirdQuartile())) {
            capacity = 1.5;
        }

        this.capacity = capacity;
    }

    return this.capacity;
}

/**************************************************************
* name: addCourse
* desc: Adds a course to the students course list and adds the 
*       courses score to the students load.
* inputs: 
*       course: course object to add
* outputs: none
**************************************************************/
Student.prototype.addCourse = function(course){
    if(!this.courses) this.courses = [];
    this.courses.push(course);
    if(!this.load)this.load = 0;
    this.load += course.getScore();
}

/**************************************************************
* name: addDepartment
* desc: ??
* inputs: 
*       course: department to add
*       name: ??
* outputs: none
**************************************************************/
Student.prototype.addDepartment = function(department, name){
    if(!this.load)this.load = 0;
    if(!this.courses)this.courses = {};
    this.courses[name] = department;
    this.load += department.score;
   // console.log("Student Load: "+this.load,department);
}


//Debugging

/*
function roundToTens(number){return Math.ceil(number/10)*10;}
var student = new Student("Eric", 1, 195);
var studentData = [195,150,114,112,108,88,78,70,64,58,56,54,52,43,41,34,33,32,31,31,22,15,13,12,3,0,0,0,0];
var SQ = new Quartile(studentData);
console.log("Capacity: "+student.getCapacity(SQ))
console.log(roundToTens(SQ.getFirstQuartile()), roundToTens(SQ.getMedian()), roundToTens(SQ.getThirdQuartile()) );
*/
