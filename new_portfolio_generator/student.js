/*********************************************************
* name: Student
* desc: Student class
*********************************************************/
var Student = function Student(name, full_time_weight, ticket_count){
    this.name = name;
    this.fullTimeWeight = full_time_weight;
    this.ticketCount = ticket_count;
    this.currentCapacity = 0;
    this.maxCapacity = 0;
    this.teachers = [];
}

/*********************************************************
* name: determineCurrentCapacity
* desc: Does math with fullTime weight and ticketCount to 
*       determine the current capacity.
* input: none
* output: current capacity
*********************************************************/
Student.prototype.determineCurrentCapacity = function() {
    
    return this.currentCapacity;
}

/*********************************************************
* name: addTeacher
* desc: Adds teacher to students teacher array and accounts
*       for its weight in the students current capacity.
* input:
*       teacher: teacher object
* output: none
*********************************************************/
Student.prototype.addTeacher = function(teacher) {
    
}

/*********************************************************
* name: removeTeacher
* desc: Removes a given teacher from students teacher array
*       and accounts for it in the students current capacity.
* input:
*       teacher: teacher object
* output: none
*********************************************************/
Student.prototype.removeTeacher = function(teacher) {
    
}

