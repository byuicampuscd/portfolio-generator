var sectionLists,
    ticketLists,
    studentsList;

var sectionsQuartile,
    ticketsQuartile,
    studentsQuartile;

var options = {
    sectionsColumn: "Sections",
    ticketsColumn: "Ticket Count\r",
    studentColumn: "Ticket Count\r",
    shifts: 5,

};

/************************************************************
* name: check
* desc: If sectionLists, ticketLists, and studentList exist 
*       build quartiles.
* inputs: none
* outputs: none
************************************************************/
function check() {
    if (sectionLists && ticketLists && studentsList) buildQuartiles();
}

var sectionReader = new CSV_Reader("section", data => {
        sectionLists = data;
        check();
    }, 2),
    studentReader = new CSV_Reader("student", data => {
        studentsList = data;
        check();
    }, 0),
    ticketReader = new CSV_Reader("tickets", data => {
        ticketLists = data;
        check();
    }, 0);

/************************************************************
* name: buildQuartiles
* desc: Makes quartiles for number of sections, students 
*       tickets, and course tickets.
* inputs: none
* outputs: none
************************************************************/
function buildQuartiles() {

    //making array of course tickets
    var tickets = [];
    for (var i in ticketLists) {
        var j = parseInt(ticketLists[i][options.ticketsColumn]);
        if (j)
            tickets.push(j);
    }

    //make course tickets quartile
    ticketsQuartile = (new Quartile(tickets));

    //making array of numbers of sections
    var sections = [];
    for (var i in sectionLists) {
        var j = parseInt(sectionLists[i][options.sectionsColumn]);
        if (j)
            sections.push(j);
    }

    //make sections quartile
    sectionsQuartile = (new Quartile(sections));

    //making array of students tickets
    var students = [];
    for (var i in studentsList) {
        if (i != undefined) {
            var j = parseInt(studentsList[i][options.studentColumn]);

            if (j >= 0)
                students.push(j);
        }
    }

    //make students tickets quartile
    studentsQuartile = (new Quartile(students));

    rankData();
}

/************************************************************
* name: rankData
* desc: 
* inputs: none
* outputs: none
************************************************************/
function rankData() {
    
    //make course object array
    var courses = [];

    for (var i in sectionLists) {

        if (!ticketLists[i]) {
            ticketLists[i] = {};
            ticketLists[i][options.ticketsColumn] = ticketsQuartile.getMedian();
        }
        courses.push(new Course(i, sectionLists[i]["Email"], sectionLists[i].Sections, ticketLists[i][options.ticketsColumn], sectionLists[i].Department_Name));
    }

    //make student object array
    var students = [];

    for (var i in studentsList) {

        students.push(new Student(i, studentsList[i]["Full Time Weight"], studentsList[i][options.studentColumn]));
    }
    
    //I think this ranks everything
    generatePortfolio(students, courses);

}
