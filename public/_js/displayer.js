var users;

database.ref('users').once("value", snap => {
    users = snap.val();
})

function displayer(groups) {

    for (var i in groups) {
        var studentName = i,
            studentInfo = groups[i];

        for (var j in users) {
            var user = users[j];

            if (user.displayName === studentName) {
                var container = $('<div id="container"></div>'),
                    studentContainer = $('<div class="studentContainer"></div>');
            }
        }
    }

}
