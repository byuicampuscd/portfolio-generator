var Renderer = function Renderer() {};
Renderer.prototype.sortStudents = (students, groups, callback) => {
    function getIndexes(object) {
        var index = [];
        for (var i in object) index.push(i)
        index.sort((a, b) => {
            var c = parseInt(a);
            var d = parseInt(b);
            if (c > d) return 1;
            if (d < c) return -1
            else return 0;
        });
        return index;
    }

    function sizeOf(object) {
        var size = 0;
        for (var i in object) size++;
        return size;
    }
    var options = getIndexes(students);
    console.log(options);
    var shifts = {};
    for (var i = 0; i < groups; i++) shifts[`Group ${i+1}`] = {};
    var total = 0;
    var data = {};
    var highest = options[0];
    for (var i in options) {
        total += students[options[i]].length;
        var amount = students[options[i]].length / groups
        data[options[i]] = Math.ceil(amount) // (amount < 1) ? 1 : Math.round(amount);
        if (data[options[i]] > data[highest]) highest = options[i]
    }
    var max = Math.ceil(total / groups);
    console.log(max, total);
    //data[highest]--;
    console.log(data);
    var to = 0;
    var t = 0;
    var tick = 0;
    var s = "";
    while (t < total && to < 1000) {
        t = 0;
        for (var i in students)
            for (var j in students[i]) {
                if (this.injectStudent(students[i][j], data)) {
                    students[i].splice(students[i].indexOf(students[i][j]), 1);
                    tick++;
                }
            }
        for (var i in shifts) t += shifts[i].size;
        //console.log(t)
        to++;
        if (to > 999) console.warn("Loop exceeded maximium runtime");
    }
    for (var i in shifts)
        for (var j in shifts[i])
            if (j != "size") s += j + "\n";
    console.log(s);
    console.log(students, tick);
    console.log(shifts);
    callback(shifts);


}

Renderer.prototype.injectStudent = function injectStudent(student, data) {
        var op = getIndexes(shifts);
        var added = false;
        if (!student.capacity) student.capacity = 10;
        var limit = data[student.capacity];
        var g = shifts;
        for (var i in g) {
            var gt = 0;
            var found = 0;
            for (var j in g[i]) {
                if (g[i][j].capacity == student.capacity) found++;
                gt++;
            }
            //            if(op.indexOf(i) >= op.length - 1)
            //  console.log(op.indexOf(i))
            if (!(found >= limit) && gt <= max /*|| op.indexOf(i) >= op.length - 1*/ ) {
                g[i][student.name] = student;
                added = true;
                break;
            }
            //console.log(i);
        }
        for (var i in shifts) shifts[i].size = sizeOf(shifts[i]) - 1;
        shifts = g;
        if (!added) console.log(limit);
        return added;
    }

Renderer.prototype.sortManual =(students, groups, callback)=> {
    var manual = {
        "Team 1":{
            'Zach Williams':{},
            'Matthew Jones':{},
            'Sara Balter':{},
            'Anne Chambers':{},
            'Matt Wyndham':{},
            'Jing Song Huang':{},
            'Jared Moreno Acosta':{},
            'Camille Stiles':{}
        },
        "Team 3":{
            "Sam McGrath":{},
            "Mackenzy Taylor":{},
            "Scott O'Neal":{},
            "Seth Childers":{},
            "Jason Braithwaite":{},
            "Katy Kempton":{},
            "Felipe Chora Chavez":{},
            "Ashwini Krishnan":{},
            "Meghan Cottam":{},
            "Seth Benson":{},
            "Emily Galbraith":{}
        },
        "Team 2":{
             "Scott Terry":{},
            "Johnna Franks":{},
            "Hannah Spear":{},
            "Taylor Scott":{},
            "JJ Aragon":{},
            "Nate Hjorth":{},
            "Jonathan Manoa":{},
        },
        "Team 4":{
            "Chris Drake":{},
            "Juan Alvarez Varas":{},
            "Oaklie Wayman":{},
            "Jacob Patterson":{},
            "Austin Swenson":{},
            "Richlue Kpakor":{},
            "Cole Herrin":{}
        }


    }

    var totalSorted = 0;
    var left = cloneObject(students);
    console.log("students",students);
    for (var i in students){
        for(var j in students[i]){
            var found = false;
            for(var a in manual){
                if(students[i][j].name in manual[a]){
                    manual[a][students[i][j].name] =students[i][j];
                    left[i].splice(j,1);
                    found = true;
                }else{
                   // console.log(students[i][j].name +" is not in " + manual[a])
                }
            }

            if(!found)console.log(students[i][j].name);
        }
    }

    console.log("Left",left);
    console.log(manual);

   callback(manual);
}

function cloneObject(object){
    return JSON.parse(JSON.stringify(object));
}

var CSV = function CSV() {
    this.csv = "";
};
CSV.prototype.addLine = (text) => {
    if (!this.csv) this.csv = "";
    this.csv += text + "\n";
}
CSV.prototype.addItem = (item) => {
    if (!this.csv) this.csv = "";
    this.csv += item + ",";
}
CSV.prototype.endLine = () => {
    if (!this.csv) this.csv = "";
    this.csv += "\n";
    //console.log(this.csv);
}
CSV.prototype.getCSV = () => {
    if (!this.csv) this.csv = "";
    return this.csv;
}
CSV.prototype.clear = () => {
    this.csv = "";
}
Renderer.prototype.groupsToCSV = function (groups) {
        var csvs = {};
        console.log(groups);
        for (var i in groups) {
            //console.log(i);
            var csvFile = new CSV();
            csvFile.addLine(i);
            for (var j in groups[i]) {
                if (j != "size") {
                    csvFile.addLine(j);
                    csvFile.addLine("Courses:");
                    for (var a in groups[i][j].courses) {
                        csvFile.addLine(a);
                        csvFile.addLine("Course Lead,Department,Name")
                        for (var b in groups[i][j].courses[a]) {
                            csvFile.addItem(groups[i][j].courses[a][b].course_lead);
                            csvFile.addItem(groups[i][j].courses[a][b].department);
                            csvFile.addItem(groups[i][j].courses[a][b].name);
                            csvFile.endLine();
                        }
                        //console.log("Running", a, csvFile.getCSV());
                        csvFile.endLine();
                    }
                }
            }
            //console.log(csvFile.getCSV());
            //console.log(i);
            csvs[i] = csvFile.getCSV();
            csvFile.clear();
        }
        return csvs;
    }
    //var studentData = JSON.parse(localStorage.sud);
   // new Renderer().sortManual({0:{"Juan Alvarez":{working:"Probably"}, "person":{working:"Not in a thousand years..."}}}, 5);
