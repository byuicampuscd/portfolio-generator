/*********************************************************
* name: Teacher
* desc: Teacher class
*********************************************************/
var Teacher = function(name) {
    this.name = name;
    this.courses = [];
    this.weight = 0;
}

/*********************************************************
* name: determineTeacherWeight
* desc: Does math with course weights to determine the 
*       teachers weight.
* input: none
* output: none
*********************************************************/
Teacher.prototype.determineTeacherWeight = function() {
    
}

/*********************************************************
* name: addCourse
* desc: Adds a given course to the teacher.
* input:
*       course: course object
* ouput: none
*********************************************************/
Teacher.prototype.addCourse = function(course) {
    
}

/*********************************************************
* name: removeCourse
* desc: Removes a course from the teacher and adjusts the 
*       weight.
* input:
*       course: course object
* ouput: none
*********************************************************/
Teacher.prototype.removeCourse = function(course) {
    
}

/*********************************************************
* name: Course
* desc: Course class
*********************************************************/
var Course = function Course(name, course_lead, section, ticket, department /*optional*/ ) {
    this.name = name;
    this.courseLead = course_lead;
    this.section = section;
    this.ticket = ticket;
    this.weight = this.determineCourseWeight();
    if (department) this.department = department;
}

/*********************************************************
* name: determineCourseWeight
* desc: Does math with sections and tickets
*********************************************************/
Course.prototype.determineCourseWeight = function() {
    
}