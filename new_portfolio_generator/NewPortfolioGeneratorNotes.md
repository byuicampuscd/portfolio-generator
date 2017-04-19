## New Portfolio Generator Notes

### Goals
1. Students keep their courses from last semester
1. Course leads work with **one** student
1. Students stay in the same teams

### Multiple Knapsack Problem Resources
* https://www.npmjs.com/package/knapsack-js - one knapsack
* https://en.m.wikipedia.org/wiki/Knapsack_problem - knapsack prob def
* https://github.com/thedanschmidt/multiknapsack.js/blob/master/src/multiknapsack.js
* https://www.npmjs.com/package/bin-packer
* https://www.npmjs.com/package/boxpack - all bins are the same size
* https://github.com/benjameep/schedule-thingy - matching algorithm

### Overall Process
  1. Read CSV files
  
  1. Combine new and old data to make object arrays
      * Need to seperately account for these
         - course no longer exists
         - student has left
         - course lead changed
      * The math will account for these
         - student ticket count has changed dramatically
         - student full time weight has changed
         - dramatically different ammount of sections
         - class load/ticket count has changed
           
  1. Determine teacher weights and student capacities
  
  1. Assign everything that is unassigned
  
  1. Write new CSV files
  
### Pseudo Code
1. Read CSV's
   * d3-dsv 
1. Remove old students/start teachers array
   * If student is gone release courses
       - update course info
       - find current teachers
       - make and add to new teacher array
1. Make students array 
   * Assign current student info
1. Update and add students courses/teachers info
   * find students courses/teachers in current courses
       - if course is gone remove it 
       - update course info and add it to student
1. Determine sttudent capacities
   * general
       - #courses/#students
   * specific
       - each shudent based off of
           * full time weight
           * #tickets
1. Determine teacher weights
   * loop through teachers
       - based off of 
           * #sections
           * #tickets
1. Break teacher weights
   * Go through capacities and weights
       - if current capacity is greater than max capacity
           * release the least amount of teachers to match current and max capacity
           * released teachers are put in teachers array
1. Assign remaining teachers to students
   * Sort teachers (highest weight at the top)
   * Sort Students (highest capacities at the top)
   * Loop through students
       - give students teachers that don't push them over student max capacity
1. Do team stuff?
1. Write csv's?

### updateData - Pseudo Code
```
combineData(currentSectionList, 
            currentTicketList, 
            currentStudentList,   
            lastSemester) {
            
  //sort all info to match up side to side
  //make object arrays based off of current csv's
  //make object arrays based off of old csv's
  
  //If different number of students
  cry
  
  //go through students first
  for (students) {
    //Student has left/new student
    if (current student is not in oldStudents) {
      set student assigned to false //unassigned
    }
    if (old student is not in currentStudents) {
      set assigned in courses assigned to that student to false
    }
    
  //go through courses next
  for (courses) {
    //Course no longer exists
    if (oldCourse not in currentCourses) {
      remove course from student
      set student assigned to false //partially assigned
    }
  }
}    

```
### Objects
```
teacherObj {
  name: string       //from course sections csv
  weight: number     //determined from courses
  courses: objects   //from course sections csv
  assigned: bool     //from if statement logic and last semester CSV
}

courseObj {
  name: string       //if doesn't exist delete and drop from student
  department: string //from new course varient list
  tickets: number    //from course tickets csv
  sections: number   //from new course varient list - I don't know it's purpose
}

studentObj {
  name: string           //from new student CSV, if gone drop courses and delete student
  maxCapacity: number
  currentCapacity: number
  fullTimeWeight: number //from new student CSV, if increased set student to unassigned
                         //if decreased drop some courses
  ticketCount: number    //from new student CSV, if increased a lot drop courses - maybe
  teachers: objects       //from last semester CSV
  team: number           //from last semester CSV
  assigned: bool        
}
```
    
### CSV's needed:
* New Student Rank
* New Course Rank
* New Course Varient List
* All Last Semester Team CSV's

### NPM
* stats-collector
* d3-dsv
