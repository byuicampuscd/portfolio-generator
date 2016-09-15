var users;

database.ref('users').once("value", snap => {
    users = snap.val();
})

function checkImg(studentname, img) {

    for (var z in users) {
        var user = users[z];

        if (user.displayName === studentname) {
            img.attr("src", user.photoURL)
        }
    }
}

function displayCourseAssignment(courseDataInfo, studentContainer) {
    var courses = courseDataInfo.courses;

    for (var i = 0; i < courses.length; i++) {
        var courseLead = $(`<p>${courses[i]['course_lead']}</p>`),
            department = $(`<p>${courses[i].department}</p>`),
            courseName = $(`<p>${courses[i].name}</p>`);

        studentContainer
            .append(department)
            .append(courseName)
            .append(courseLead);
    }
}

function addInfo(student, studentContainer) {
    var courseAssignment = student.courses;

    for (var i in courseAssignment) {
        var detail = courseAssignment,
            name = i,
            courseDataInfo = courseAssignment[i];

        studentContainer.append(`<h3>${name}</h3>`);

        if (name !== "full_time_weight" && name !== "load" && name !== "name" && name !== "ticket_count") {
            displayCourseAssignment(courseDataInfo, studentContainer);
        }
    }
}

function displayTeam(students, teamContainer, group) {

    teamContainer.append(group);

    for (var j in students) {
        var student = students[j],
            studentname = j,
            studentContainer = $("<div></div>"),
            studentPara = $(`<p>${studentname}</p>`),
            img = $('<img style="width: 100px;">');

        img.attr("src", "../images/blank-profile.png");

        checkImg(studentname, img);

        studentContainer.append(img);
        studentContainer.append(studentPara);

        addInfo(student, studentContainer);

        if (studentname !== "size") teamContainer.append(studentContainer);
    }
}

function displayer(groups) {

    console.log(groups)

    var container = $('<div id="container"></div>')

    for (var i in groups) {
        var students = groups[i],
            teamContainer = $('<div id="teamcontainer"></div>'),
            group = $(`<h2>${i}</h2>`);

        displayTeam(students, teamContainer, group);

        container.append(teamContainer);
    }

    $("#portfolioOutput").append(container);

//    database.ref('portfolio/data').set(groups);

}
