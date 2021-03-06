function checkImg(users, studentname, img) {

    for (var z in users) {
        var user = users[z];

        var clean = studentname.replace(" (FT)", "")

        if (user.displayName === clean) {
            img.attr("src", user.photoURL)
        }
    }
}

function displayCourseAssignment(courseDataInfo, studentContainer, coursesCont) {

    var courses = courseDataInfo;

    for (var i = 0; i < courses.length; i++) {
        var courseLead = $(`<p>Course Lead: ${courses[i]['course_lead']}</p>`),
            department = $(`<p>Department: ${courses[i].department}</p>`),
            courseName = $(`<p>${courses[i].name}</p>`),
            courseContainer = $("<div></div>");

        courseContainer
            .attr("class", "courseContainer");

        courseContainer
            .append(courseName)
            .append(department)
            .append(courseLead);

        coursesCont
            .append(courseContainer)
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
                status = e.target.getAttribute("data-status");

            if (status === "closed") {
                $(target)
                    .css({
                        "display": "flex"
                    });
                $(e.target).attr("data-status", "open");
            } else if (status === "open") {
                $(target)
                    .css({
                        "display": "none"
                    });
                $(e.target).attr("data-status", "closed");
            }
        });
}

function addInfo(student, studentContainer) {
    var courseAssignment = student.courses;

    if (student.isLead === true) {
        studentContainer.append("<p>Team Lead</p>")
    }

    for (var i in courseAssignment) {
        var detail = courseAssignment,
            name = i.replace(" (A)", ""),
            courseDataInfo = courseAssignment[i],
            coursesCont = $("<div></div>"),
            headerName = $(`<h3>${name}</h3>`);

        headerName
            .attr("data-status", "closed");

        hiderShower(headerName);

        studentContainer
            .append(headerName);

        if (name !== "full_time_weight" && name !== "load" && name !== "name" && name !== "ticket_count") {
            displayCourseAssignment(courseDataInfo, studentContainer, coursesCont);
        }
    }
}

function displayTeam(students, teamContainer, group, dropdownArrow) {

    teamContainer.append(group);

    var oneContainerToRuleThemAll = $("<div></div>");

    dropdownArrow.attr("id", "dropArrowMain");

    teamContainer.append(dropdownArrow);

    oneContainerToRuleThemAll
        .css({
            display: "none"
        });

    for (var j in students) {
        var student = students[j],
            studentname = j.replace(" (FT)", ""),
            studentContainer = $("<div id='studentContainer'></div>"),
            studentPara = $(`<p>${studentname}</p>`),
            img = $('<img style="width: 100px;">');

        img.attr("src", "../images/blank-profile.png");

        database.ref('users').once("value", snap => {
            var users = snap.val();
            checkImg(users, studentname, img);
        });

        studentContainer
            .append(img)
            .append(studentPara);

        addInfo(student, studentContainer);

        if (studentname !== "size") oneContainerToRuleThemAll.append(studentContainer);
    }

    teamContainer.append(oneContainerToRuleThemAll);
}

function displayer(groups) {

    var container = $('<div id="container"></div>');

    for (var i in groups) {

        if (typeof groups[i] === "object") {

            var students = groups[i],
                teamContainer = $('<div id="teamcontainer"></div>'),
                dropdownArrow = $('<div></div>'),
                group = $(`<h2>${i}</h2>`);

            dropdownArrow.attr("data-status", "closed");

            hiderShower(dropdownArrow);

            displayTeam(students, teamContainer, group, dropdownArrow);

            container.append(teamContainer);
        }

    }

    $("#portfolioOutput").html("");
    $("#portfolioOutput").append(container);

    return;

}
