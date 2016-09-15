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

function displayCourseAssignment(courseDataInfo, studentContainer, coursesCont) {
    var courses = courseDataInfo.courses;

    for (var i = 0; i < courses.length; i++) {
        var courseLead = $(`<p>Course Lead: ${courses[i]['course_lead']}</p>`),
            department = $(`<p>Department: ${courses[i].department}</p>`),
            courseName = $(`<p>Course Name: ${courses[i].name}</p>`),
            courseContainer = $("<div></div>");

        courseContainer
            .attr("class", "courseContainer");

        courseContainer
            .append(department)
            .append(courseName)
            .append(courseLead);

        coursesCont
            .append(courseContainer)
            .attr("data-show", "false")
            .css({
                display: "none"
            });

        studentContainer
            .append(coursesCont);
    }
}

function hiderShower(ele) {
    ele
        .css({
            "cursor": "pointer"
        })
        .click(e => {
            var target = e.target.nextElementSibling,
                show = target.getAttribute("data-show");

            if (show === "false") {
                $(target)
                    .css({
                        "display": "flex"
                    })
                    .attr("data-show", "true");
            } else if (show === "true") {
                $(target)
                    .css({
                        "display": "none"
                    })
                    .attr("data-show", "false");
            }
        });
}

function addInfo(student, studentContainer) {
    var courseAssignment = student.courses;

    for (var i in courseAssignment) {
        var detail = courseAssignment,
            name = i,
            courseDataInfo = courseAssignment[i],
            coursesCont = $("<div></div>"),
            headerName = $(`<h3>${name} (Click)</h3>`);

        hiderShower(headerName);

        studentContainer
            .append(headerName);

        if (name !== "full_time_weight" && name !== "load" && name !== "name" && name !== "ticket_count") {
            displayCourseAssignment(courseDataInfo, studentContainer, coursesCont);
        }
    }
}

function displayTeam(students, teamContainer, group) {

    teamContainer.append(group);

    var oneContainerToRuleThemAll = $("<div></div>");

    oneContainerToRuleThemAll
        .attr("data-show", "false")
        .css({
            display: "none"
        });

    for (var j in students) {
        var student = students[j],
            studentname = j,
            studentContainer = $("<div id='studentContainer'></div>"),
            studentPara = $(`<p>${studentname}</p>`),
            img = $('<img style="width: 100px;">');

        img.attr("src", "../images/blank-profile.png");

        checkImg(studentname, img);

        studentContainer
            .append(img)
            .append(studentPara);

        addInfo(student, studentContainer);

        if (studentname !== "size") oneContainerToRuleThemAll.append(studentContainer);
    }

    teamContainer.append(oneContainerToRuleThemAll);
}

function displayer(groups) {

    console.log(groups)

    var container = $('<div id="container"></div>')

    for (var i in groups) {
        var students = groups[i],
            teamContainer = $('<div id="teamcontainer"></div>'),
            group = $(`<h2>${i} (Click)</h2>`);

        hiderShower(group);

        displayTeam(students, teamContainer, group);

        container.append(teamContainer);
    }

    $("#portfolioOutput").append(container);

    return;

    //    database.ref('portfolio/data').set(groups);

}
