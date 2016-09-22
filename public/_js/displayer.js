var users;

function checkImg(studentname, img) {

    for (var z in users) {
        var user = users[z];

        if (user.displayName === studentname) {
            img.attr("src", user.photoURL)
        }
    }
}

function displayCourseAssignment(courseDataInfo, studentContainer, coursesCont) {

    var courses = courseDataInfo,
        closeButton = $('<input type="button" value="close">');

    closeButton.click(e => {
        var parent = e.target.parentElement;

        $(parent).css({
            display: "none",
        })
    })

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

    coursesCont.append(closeButton);
}

function hiderShower(ele) {
    ele
        .css({
            "cursor": "pointer"
        })
        .click(e => {
            var target = e.target.nextElementSibling,
                id = e.target.parentElement.id;
            $(target)
                .css({
                    "display": "flex"
                })
        });
}

function addInfo(student, studentContainer) {
    var courseAssignment = student.courses;

    for (var i in courseAssignment) {
        var detail = courseAssignment,
            name = i,
            courseDataInfo = courseAssignment[i],
            coursesCont = $("<div></div>"),
            headerName = $(`<h3>${name}</h3>`);

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

    var oneContainerToRuleThemAll = $("<div></div>"),
        closeButton = $('<input type="button" value="close">');

    dropdownArrow.attr("id", "dropArrowMain");

    teamContainer.append(dropdownArrow);

    closeButton.click(e => {
        var parent = e.target.parentElement;

        $(parent).css({
            display: "none",
        })
    })

    oneContainerToRuleThemAll
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

    oneContainerToRuleThemAll.append(closeButton);

    teamContainer.append(oneContainerToRuleThemAll);
}

function displayer(groups) {

    var container = $('<div id="container"></div>');

    for (var i in groups) {
        var students = groups[i],
            teamContainer = $('<div id="teamcontainer"></div>'),
            dropdownArrow = $('<div></div>'),
            group = $(`<h2>${i}</h2>`);

        hiderShower(dropdownArrow);

        displayTeam(students, teamContainer, group, dropdownArrow);

        container.append(teamContainer);
    }

    $("#portfolioOutput").append(container);

    return;

}
