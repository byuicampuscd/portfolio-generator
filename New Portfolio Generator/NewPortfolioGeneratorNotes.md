## New Portfolio Generator Notes

### Today
1. figure out catalouger -- it's rough
1. see if we can write one file with all teams in one -- I believe it's possible
1. figure out how many readers we need -- min 7, max 10 :(
1. figure out logic for if statements

### Goals
1. Students keep their courses from last semester
1. Course leads work with **one** student
1. Students stay in the same teams

### To Do
#### Files to be redone
* main
* catalouger
#### Files to be altered
* course
* student  

### Overall Process
  1. Read CSV files
  
  1. Combine new and old data
    drop students courses under below conditions
    
      - student ticket count has changed dramatically
      - student has left
      - student full time weight has changed
      - course lead changed
      - class load/ticket count has changed
      - course no longer exists
      - dramatically different ammount of sections
      
  1. Determine course weights and student capacities
  
  1. Assign everything that is unassigned
  
  1. Write new CSV files
  
### main - Pseudo Code
```
Read files
Make quartiles
Rank data
```

### catalouger - Pseudo Code
```
Generate portfolio
```
### combine data - Pseudo Code
```
combineData(newSectionList, newTicketList, newStudentList, oldSectionList, oldTicketList, oldStudent List, lastSemester) {


```
### Objects
```
courseObj {
  department: string //from new course varient list
  courseLead: string //if changed drop course from student, set assigned to false
  courseCode: string //if doesn't exist delete and drop from student
  sections: number   //from new course varient list - I don't know it's purpose
  student: object    //from last semester CSV
  assigned: bool     //from if statement logic and last semester CSV
}
studentObj {
  name: string           //from new student CSV, if gone drop courses and delete student
  fullTimeWeight: number //from new student CSV, if increased set student to unassigned
                         //if decreased drop some courses
  ticketCount: number    //from new student CSV, if increased a lot drop courses - maybe
  courses: objects       //from last semester CSV
  team: number           //from last semester CSV
  assigned: number       //maybe 0-false, 1-true, 2-partial
}
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
