## New Portfolio Generator Notes

### Goals
1. Students keep their courses from last semester
1. Course leads work with **one** student
1. Students stay in the same teams

### To Do
* Figure out how we want to determine weights and capacities
* Quartiles?


### Overall Process
  1. Read CSV files
  
  1. Combine new and old data
    drop students courses under below conditions
       needeperately account for
      - course ro longer exists
      - student has left
      - course lead changed
    * the math will account for these
      - student ticket count has changed dramatically
      - student full time weight has changed
      - dramatically different ammount of sections
      - class load/ticket count has changed
      
      
  1. Determine teacher weights and student capacities
  
  1. Assign everything that is unassigned
  
  1. Write new CSV files
  
### main - Pseudo Code
```
Read files
Make quartiles
Rank data
```

### assign - Pseudo Code
```
Generate portfolio
```
### updateData - Pseudo Code
```
combineData(currentSectionList, 
            currentTicketList, 
            currentStudentList,  
            oldSectionList, 
            oldTicketList, 
            oldStudent List, 
            lastSemester) {
            
  //sort all info to match up side to side
  //make object arrays based off of current csv's
  //make object arrays based off of old csv's
  
  //If different number of students
  cry
  
  //go through students first
  for (students) {
    //1. Student has left/new student
    if (current student is not in oldStudents) {
      set student assigned to false //unassigned
    }
    if (old student is not in currentStudents) {
      set assigned in courses assigned to that student to false
    }
    //2. Student full time weight has changed
    if (currentStudent_fullTimeWeight > oldStudent_fullTimeWeight) {
      set student assigned to false //partially assigned
    } else if (currentStudent_fullTimeWeight < oldStudent_fullTimeWeight) {
      remove courses until load matches new weight//???
      set removed courses assigned to false
    }
    //3. Student ticket count has changed dramatically (quartiles)
    if (currentStudent_ticketCount >>> oldStudent_ticketCount) {
      set student assigned to false //partially assigned
    }
    
  //go through courses next
  for (courses) {
    //4. Class load/ticket count has changed dramatically
    if (currentCourse_tickets really different from oldCourse_tickets) {
      //resets that students courses
    }
    //5. Course no longer exists
    if (oldCourse not in currentCourses) {
      remove course from student
      set student assigned to false //partially assigned
    }
    //6. Dramatically different ammounts of sections
    if (currentCourse_sections really different from oldCourseSection) {
      //resets that students courses
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
```
    
### CSV's needed:
* Old Student Rank
* Old Course Rank
* Old Course Varient List
* New Student Rank
* New Course Rank
* New Course Varient List
* All Last Semester Team CSV's
  - can fill everything in course array except course sections number
  - four files :(
