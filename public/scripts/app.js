(function () {

    var LoadPortfolio = React.createClass({

        loadNewPortfolio: function (e) {
            document.querySelector("#portfolioOutput").innerHTML = "<h1>New Portfolio!</h1>";
        },

        loadPreviousPortfolio: function (e) {
            document.querySelector("#portfolioOutput").innerHTML = "<h1>Old portofolio!</h1>";
        },

        render: function () {
            return ( <div id = "portfolio" >
                        < h2 > Portfolio < /h2>
                        < input type = "button"
                                value = "Load New Portfolio?"
                                onClick = {
                                    this.loadNewPortfolio
                                }
                        /> < input type = "button"
                                    value = "Load Previously Made Portfolio?"
                                    onClick = {
                                        this.loadPreviousPortfolio
                                    }
                        />
                    </div>
            );
        }

    });

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

        display: function(role) {
            if (role) {
                return {"display": "block"};
            } else {
                return {"display": "none"};
            }
        },

        showOptionsModal: function(e) {
            var options = document.querySelector("#options");

            options.style.display = "block";
        },

        useFile: function (e) {
            var input = e.target,
                file = input.files[0],
                reader = new FileReader(),
                node = document.getElementById('portfolioOutput');

            reader.readAsText(file);

            reader.onload = function () {
                var text = reader.result;

                node.innerText = text;

                database.ref('portfolio').set({
                    "data": text
                });

                console.log("File Info: ", file);
                console.log("File Preview: ", reader.result.substring(0, 200));
            };
        },

        render: function () {
            return ( < div id = "inputs" >
                        <h2> Inputs </h2>
                        <input onChange = { this.useFile } type = "file" id = "file1" / >
                        <input onChange = { this.useFile } type = "file" id = "file2" / >
                        <input style={ this.display(this.props.role) } onClick = { this.showOptionsModal } type = "button" value="Show Options" / >
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

            var users = database.ref('users');

            this.bindAsObject(users, 'users');

            users.on("value", this.handleDataLoaded);

            console.log(this);
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
                        < LoadPortfolio prevPortfolio = { this.state.portfolio } />
                        < div id = "portfolioOutput" > < /div>
                        < Options / >
                    < /div>
            );
        }
    });

    ReactDOM.render( < App / > , document.querySelector("#app"));

}());
