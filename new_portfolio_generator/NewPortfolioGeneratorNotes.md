## New Portfolio Generator Notes

### Goals
1. Students keep their courses from last semester
1. Course leads work with **one** student
1. Students stay in the same teams

### To Do
* Figure out how we want to determine weights and capacities
* make a readable last semester csv 

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
  
### All Functions Pseudo Code
  1. Read files
     
  1. Make Students
  1. Determine Weights and Capacities
  1. Make Teachers
  1. Assign
  1. Write Files

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