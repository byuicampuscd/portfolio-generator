(function () {

    var Options = React.createClass({

        closeModal: function(e) {
            var parent = e.target.parentElement;
            parent.style.display = "none";
        },

        render: function () {
            return ( < div id = "options" >
                < h2 > Options < /h2>

                < label >
                Sections Column < input type = "text" / >
                < label >
                End Column ? < input type = "checkbox" / >
                < /label> < /label>

                < label >
                Tickets Column < input type = "text" / >
                < label >
                End Column ? < input type = "checkbox" / >
                < /label> < /label>

                < label >
                Student Column < input type = "text" / >
                < label >
                End Column ? < input type = "checkbox" / >
                < /label> < /label>

                < label >
                Shifts < input type = "number" / >
                < /label>

                < h3 > Sections < /h3>

                < label >
                Larger Course Weight < input type = "number" / >
                < /label>

                < label >
                Smaller Course Weight < input type = "number" / >
                < /label>

                < h3 > Tickets < /h3>

                < label >
                Larger Course Weight < input type = "number" / >
                < /label>

                < label >
                Smaller Course Weight < input type = "number" / >
                < /label>

                <input value="Close" onClick={this.closeModal} type="button" />

                < /div>
            );
        }

    });

    var Inputs = React.createClass({

        fileUpload: function(e) {
            var fileText = document.createTextNode(" File Attached")
            e.target.parentElement.appendChild(fileText);
        },

        display: function(role) {
            if (role) {
                return {"display": "block"};
            } else {
                return {"display": "none"};
            }
        },

        render: function () {

            return ( < div style={ this.display(this.props.role) } id = "inputs" >
                        <h2>Input CSVs</h2>
                        <p>Upload the CSV files to replace the data in Firebase.</p>
                        <label className="custom-file-upload">Section Data CSV (Course Variant)<input onChange = { this.fileUpload } type = "file" id = "section" /></label>
                        <label className="custom-file-upload">Tickets Data CSV (Course Rank) <input onChange = { this.fileUpload } type = "file" id = "tickets" /></label>
                        <label className="custom-file-upload">Student Data CSV (Student Rank) <input onChange = { this.fileUpload } type = "file" id = "student" /></label>
                    < /div>
            );
        }

    });

var App = React.createClass({

        mixins: [ReactFireMixin],

        getInitialState: function () {
            return {
                loaded: false
            }
        },

        handleDataLoaded: function () {
            this.setState({
                loaded: true
            });
        },

        componentWillMount: function () {
            var users = database.ref('users'),
                portfolio = database.ref('portfolio/data');
            this.bindAsObject(users, 'users');
            this.bindAsObject(portfolio, 'portfolio');
            users.on("value", this.handleDataLoaded);
        },

        loadPortfolio: function() {
            var portfolio = this.state.portfolio;
            displayer(portfolio);
        },

        render: function () {
            var role,
                users = this.state.users;

            for (var i in users) {
                var user = users[i];
                if (typeof user === "object" && user.role === 10) {
                    role = user.role;
                }
            }

            return ( < div id = "portfolioMain" >
                        <header>
                            <h1> Portfolio Generator </h1>
                            <Inputs role = { role } />
                        </header>
                        < div id = "portfolioOutput" > { this.loadPortfolio() } < /div>
                        < Options / >
                    < /div>
            );
        }
    });

    ReactDOM.render( < App / > , document.querySelector("#app"));

}());
