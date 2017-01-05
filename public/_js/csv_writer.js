var CSV_Writer = function CSV_Writer(){}
CSV_Writer.prototype.writeFile = (name,data,oncomplete) =>{
//    console.log("Wroking",window.webkitRequestFileSystem);
    window.webkitRequestFileSystem(TEMPORARY, 900 * 1024 * 1024, (fs) => {
        log(fs);

        fs.root.getFile(`${name}.csv`, {
            create: true
            , exclusive: false
        }, (entry) => {
            log(entry.fullPath);
            entry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function (e) {
                    console.log('Write completed.');
                };
                fileWriter.onerror = function (e) {
                    console.log('Write failed: ' + e.toString());
                };
                // Create a new Blob and write it to log.txt.
                var blob = new Blob([data], {
                    type: 'text/plain'
                });
                fileWriter.write(blob);
            }, EH);

            entry.file((file) => {
                var reader = new FileReader();
                reader.onloadend = function (e) {
//                    var txtArea = document.createElement('textarea');
//                    txtArea.value = this.result;
//                    document.body.appendChild(txtArea);
                };
                reader.readAsText(file);
            }, EH);

            oncomplete(entry.toURL());



        }, EH);
    });

    function EH(e) {
        console.error(e);
    }

    function log(e) {
        console.log(e);
    }
}

/*
var gen = new CSV_Writer();
gen.writeFile("hello","test,data\nworks",(link)=>{
    console.log(link);
});
*/

//console.log(gen.URL);
