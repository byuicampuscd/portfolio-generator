/**************************************************************
* optionz object
* desc: These are the default optionz for the section and ticket
*       weights.
**************************************************************/
var optionz = {
    section: {
        higherWeight: 1.5,
        lowerWeight: 0.5
    },
    ticket: {
        higherWeight: 1.5,
        lowerWeight: 0.5
    },
}

/*************************************************************
* Course class
* desc: This is the constructor for the Course Object. The 
*       course class holds all of the course data and then 
*       determines its relative weight based off of how many 
*       sections and tickets it holds.
*************************************************************/
var Course =
    function Course(name, course_lead, section, ticket, department /*optional*/ ) {
        this.name = name;
        this.course_lead = course_lead;
        this.section = section;
        this.ticket = ticket;
        if (department) this.department = department;
//        console.log(department);
    }

/**************************************************************
* name: scoreAttribute
* desc: This gives a score to each item based off of which 
*       quartile it fits in.
* inputs: 
*       item: ?? don't really know what this is
*       quartile: quartile object
*       lowerWeight: the lower weight (0.5)
*       higherWeight: the higher weight (1.5)
* outputs: score
**************************************************************/
Course.prototype.scoreAttribute = function(item, quartile, lowerWeight, higherWeight) {
        var score = 0;
        if (item <= quartile.getFirstQuartile()){
            score = lowerWeight;
//            console.log("Quartile:",item,quartile.getFirstQuartile())
        }
        else if (item >= quartile.getThirdQuartile()){
            score = higherWeight;
            if(quartile.isOutlier(item)){
                score += .5
//                console.log(`We found an outlier!\nNumber:${item}`);
            }
        }
        else score = 1;
        return score;
}

/**************************************************************
* name: getScore
* desc: Gets a score that determines the course weight based off
*       of the quartiles that the course items fit in.
* inputs: 
*       quartiles: quartile object ??
* outputs: score
* notes:
*       The quartile object recieved should be in this format:
*       {
*        section: Quartile,
*        ticket: Quartile
*       }
**************************************************************/
Course.prototype.getScore = function (quartiles){
    if(! this.score){
        var sections = this.scoreAttribute(this.section, quartiles.section, optionz.section.lowerWeight, optionz.section.higherWeight);

        var tickets = this.scoreAttribute(this.ticket,quartiles.ticket, optionz.ticket.lowerWeight, optionz.ticket.higherWeight);
        var average = (tickets+sections)/2
        this.score = Math.round((Math.ceil(average*10)/10)*2)/2
    }
//    console.log(score);
    return this.score;
}

