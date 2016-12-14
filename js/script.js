
var storageCosts = {};
var persons = [];

var propTypeAccepts = {};
var propTypeNice = {};

var typeA = 'Brot';
var typeB = 'Getreide';
var typeC = 'Mehl';

var pTypeA = 'Bauer';
var pTypeB = 'Müller';
var pTypeC = 'Bäcker';

/**
 * Amount of persons of each type 1 to 3
 * @type {{type1, type2, type3}}
 */
var personTypeAmounts = {};
personTypeAmounts[pTypeA] = 0;
personTypeAmounts[pTypeB] = 0;
personTypeAmounts[pTypeC] = 0;

/**
 * Initial amount of goods of each type
 * @type {{typeA: number, typeB : number, typeC : number}}
 */
var goodsStartAmounts = {};
goodsStartAmounts[typeA] = 0;
goodsStartAmounts[typeB] = 0;
goodsStartAmounts[typeC] = 0;

/**
 * Amount of goods at the end of the simulation
 * @type {{}}
 */
var goodsEndAmounts = {};
goodsEndAmounts[typeA] = 0;
goodsEndAmounts[typeB] = 0;
goodsEndAmounts[typeC] = 0;


/**
 * Get the result of trading chat between two types of persons
 * @param probability the probability of agreeing to the trade
 * @returns {boolean} true if a trade takes place, false otherwise
 *
 */
//TODO: The decision should be made with a random decision tending to yes if the probability is closer to 1 than 0
function getDecision(probability){ // true is yes, false is no
    if(probability == 0)
        return false;
    if(probability == 1)
        return true;
    return Math.random() <= probability;
};

/**
 * Class which represents a type of a person in the experiment.
 * On creation the goodsStartAmount increases
 * @param id the identifier for the person
 * @param type the type, where it may vary from type 1 to type 3
 * @param consume the type of goods the person consumes
 * @param produce the type of goods the person produces
 * @constructor
 */
var Person = function(id, type, consume, produce){
    this.id = id;
    this.type = type;
    this.consume = consume;
    this.produce = produce;
    this.good = produce;
    goodsStartAmounts[this.good] += 1;
    this.points = startPoints;
    this.pointsBeforeRound;
    this.pointsDelta = 0;
};

/**
 * Defines the methods of the class Person.
 * @type {{roundStart: Person.roundStart, resetPointsDelta: Person.resetPointsDelta, wantTrade: Person.wantTrade, makeConcession: Person.makeConcession, doTrade: Person.doTrade, payStorage: Person.payStorage, getIdStr: Person.getIdStr, getDetails: Person.getDetails, toString: Person.toString, getDeltaPointsStr: Person.getDeltaPointsStr, getStatus: Person.getStatus}}
 */
Person.prototype = {

    /**
     * Sets the points before the simulation run starts. In the beginning the points are the start points
     */
    roundStart: function(){
        this.pointsBeforeRound = this.points;
    },

    /**
     * Puts the difference between the points back to zero.
     * The differences is shown at the end of each round to see the change
     * in points the person yielded.
     */
    resetPointsDelta: function(){
        this.pointsDelta = 0;
    },

    /**
     * Grants the outcome of a good offering to this type of person
     * @param offeredGood the type of good which is offered
     * @returns {boolean} true if the trade takes place, false otherwise
     */
    wantTrade: function(offeredGood){
        return getDecision(propTypeAccepts[this.type + offeredGood]);
    },

    /**
     * Grants the outcome of a concession trade for this type
     * @returns {boolean} true if this person is open for concession, false otherwise
     */
    makeConcession: function(){
        return getDecision(propTypeNice[this.type]);
    },

    /**
     * Trade the incomingGood with the product possessed
     * If the good is the a consumable one, the person may
     * fill his storage with the production good and earns consume bonus.
     * Else the storage good will be filled with the incomingGood
     * @param incomingGood the good which will be trade with this persons good
     */
    doTrade: function(incomingGood){
        if(incomingGood == this.consume){
            this.good = this.produce; //=incomingGood
            this.points += consumeBonus;
        }
        else
            this.good = incomingGood;
    },

    /**
     * Person pays the storage cost of the kept good. Updates the amount of
     * points earned or lost in pointsDelta
     */
    payStorage: function(){
        this.points -= storageCosts[this.good];
        this.pointsDelta = this.points - this.pointsBeforeRound;
    },

    /**
     * Grants the Id of the Person as a String
     * @returns {string}
     */
    getIdStr: function(){
        return this.id < 10 ? '0' + this.id : '' + this.id;
    },

    /**
     * Grants the details about a person, like the id string, type of person and type of good
     * @returns {string} a printable string with the details about the person
     */
    getDetails: function(){
        return '<i>[Person' + this.getIdStr() + ', Typ: <b>' + this.type + '</b>, Ware: <b>' + this.good + '</b>]</i>';
    },

    /**
     * Person id with prefix Person
     * @returns {string}
     */
    toString: function(){ //short toString
        return '<i>Person' + this.getIdStr() + '</i>';
    },

    /**
     * Grants the amount of points earned/lost the previous round
     * @returns {*}
     */
    getDeltaPointsStr: function(){
        if(this.pointsDelta == 0)
            return '';
        return '<small>(' + (this.pointsDelta < 0 ? '' + this.pointsDelta : '+' + this.pointsDelta) + ')</small>';
    },

    /**
     * A more detailed information about the person, which collects knowledge about the id, typeOfPerson, typeOfGood, points, deltaPoints
     * @returns {string}
     */
    getStatus: function(){
        return '<i>Person' + this.getIdStr() + ', Typ: <b>' + this.type + '</b>, Ware: <b>' + this.good + '</b>, Punkte: <b>' + this.points + '</b>' + this.getDeltaPointsStr() + '</i>';
    }
};

/**
 * Creates n persons of a specific type
 * @param numb the number of persons to create for this type
 * @param personType the type of persons which will be created
 * @param consumeGood the type of consume good
 * @param produceGood the type of producing good
 */
function createPersonTypeGroup(numb, personType, consumeGood, produceGood){
    for(var i = 0; i < numb; i ++){
        var p = new Person(persons.length + 1, personType, consumeGood, produceGood);
        persons.push(p);
        personTypeAmounts[personType] += 1;
        print(p.getDetails() + ' erstellt!', true);
    };
};

/**
 *  Create persons of each type equally distributed
 */
function createPersons(){
    print('<small>', true);
    var amountOfEachType = n / 3;
    createPersonTypeGroup(amountOfEachType, pTypeA, typeA, typeB);
    createPersonTypeGroup(amountOfEachType, pTypeB, typeB, typeC);
    createPersonTypeGroup(amountOfEachType, pTypeC, typeC, typeA);
    print('</small>', true);
};

/**
 * Returns a red colored String which shows a refuse of a trade
 * @returns {string}
 */
function noTrade(){
    return '<font color="red"><b>Nein</b></font>, ';
};

/**
 * Returns a green colored String which shows an agreement of a trade
 * @returns {string}
 */
function yesTrade(){
    return '<font color="green"><b>Ja</b></font>, ';
};

/**
 * Actual trading process between p1 and p2, which may yield a successful trade or failure
 * @param p1 a person which respond to a trade request
 * @param p2 a person which sets up the trade request
 */
function encounter(p1, p2){
    var log = p1.getDetails() + ' und ' + p2.getDetails() + ' handeln' + '&nbsp;&nbsp;&nbsp;<font size="2" color="gray">>></font>&nbsp;&nbsp;';
    if(p1.good == p2.good)
        log += noTrade() + "beide bieten das gleiche Konsumgut an";
    else {
        var p1wantsTrade = p1.wantTrade(p2.good);
        var p2wantsTrade = p2.wantTrade(p1.good);

        var doTrade = p1wantsTrade && p2wantsTrade;
        if(doTrade)
            log += yesTrade() + "der Handel wird von beiden Seiten akzeptiert";

        if(!p1wantsTrade && !p2wantsTrade)
            log += noTrade() + "der Handel wird von beiden Seiten abgelehnt";

        if(p1wantsTrade && !p2wantsTrade){
            if(p2.makeConcession()){
                log += yesTrade() + p1 + " möchte handeln, während " + p2 + " nicht handeln wollte, aber " + p1 + " entgegenkommt!";
                doTrade = true;
            }
            else
                log += noTrade() + p1 + " möchte handeln, aber " + p2 + " möchte es nicht!";
        }

        if(!p1wantsTrade && p2wantsTrade){
            if(p1.makeConcession()){
                log += yesTrade() + p2 + " möchte handeln, während " + p1 + " nicht handeln wollte, aber " + p2 + " entgegenkommt!";
                doTrade = true;
            }
            else
                log += noTrade() + p2 + " möchte handeln, aber " + p1 + " möchte es nicht!";
        }

        if(doTrade){
            var p1_good = p1.good;
            p1.doTrade(p2.good);
            p2.doTrade(p1_good);
        }
    }
    print(log, true);
};

/**
 * Print the status of each person
 * @param analysisMode enables the analyse mode which prints the lineNumber
 */
function showStatuses(analysisMode){
    for(var i in persons){
        var lineNumb = parseInt(i) < 9 ? '&nbsp;&nbsp;' + (parseInt(i) + 1) : '' + (parseInt(i) + 1);
        print((analysisMode ? '<font size="2" color="gray">' + lineNumb + ':</font>&nbsp;&nbsp;' : '') + persons[i].getStatus(), analysisMode ? undefined : true);
        persons[i].resetPointsDelta();
    };
};

/**
 * Runs a trading round for the persons and calculates
 * the storage costs and the total amount of points for
 * each person, which will be printed in the status part
 * @param roundNumb amount of rounds to run
 */
function oneRound(roundNumb){
    for(var i in persons)
        persons[i].roundStart();

    print('', true);
    print('<b><font size="4" color="green">Runde ' + roundNumb + '</font></b>', true);

    var indices = [];
    for(var i = 0; i < n; i ++)
        indices.push(i);

    // Pick n/2 times two persons to encounter in a trade randomly
    for(var i = 0; i < n / 2; i ++){
        var randIndex = Math.abs(Math.round(Math.random() * indices.length - 0.5));
        var p1 = persons[indices.splice(randIndex, 1)];
        randIndex = Math.abs(Math.round(Math.random() * indices.length - 0.5));
        var p2 = persons[indices.splice(randIndex, 1)];
        encounter(p1, p2);
    };

    // Let all persons pay their storage cost for the good they maintain
    for(var i in persons)
        persons[i].payStorage();
    print();
    print('<font color="gray">Status am Ende der Runde ' + roundNumb + ':</font>', true);
    showStatuses(false);
};

/**
 * Runs the given amount of trading runs
 * @param rounds amount of trading iterations
 */
function runRounds(rounds){
    for(var i = 0; i < rounds; i ++) {
        oneRound(i + 1);
    }
};

/**
 * Executes the analysis of the collected result and visualizes it
 */
function runAnalysis(){
    print('<font color="gray">Finaler Status, <b>geordnet</b>:</font>');
    persons.sort(function sortFunc(p1, p2){return p2.points - p1.points;});
    showStatuses(true);

    for(var i in persons)
        goodsEndAmounts[persons[i].good] += 1;

    var goodsPercentages = {};
    goodsPercentages[typeA + '_start'] = roundDec((goodsStartAmounts[typeA] / n) * 100, 1) + '%';
    goodsPercentages[typeB + '_start'] = roundDec((goodsStartAmounts[typeB] / n) * 100, 1) + '%';
    goodsPercentages[typeC + '_start'] = roundDec((goodsStartAmounts[typeC] / n) * 100, 1) + '%';
    goodsPercentages[typeA + '_end'] = roundDec((goodsEndAmounts[typeA] / n) * 100, 1) + '%';
    goodsPercentages[typeB + '_end'] = roundDec((goodsEndAmounts[typeB] / n) * 100, 1) + '%';
    goodsPercentages[typeC + '_end'] = roundDec((goodsEndAmounts[typeC] / n) * 100, 1) + '%';
    goodsPercentages[typeA + '_diff'] = roundDec((goodsEndAmounts[typeA] / goodsStartAmounts[typeA]) * 100, 1) + '%';
    goodsPercentages[typeB + '_diff'] = roundDec((goodsEndAmounts[typeB] / goodsStartAmounts[typeB]) * 100, 1) + '%';
    goodsPercentages[typeC + '_diff'] = roundDec((goodsEndAmounts[typeC] / goodsStartAmounts[typeC]) * 100, 1) + '%';

    printGoodPerformance(goodsPercentages, typeA);
    printGoodPerformance(goodsPercentages, typeB);
    printGoodPerformance(goodsPercentages, typeC);
};

/**
 * Displays the market share of each good and the state of knowledge after the last round about the distribution
 * in the stores of the persons
 * @param goodsPercentages the percentage amount of the given good in the stores of each person
 * @param good the specific type of good
 */
function printGoodPerformance(goodsPercentages, good){
    print();
    print('<font color="green">Marktanteil von <b>' + good + '</b>:</font>');
    if(goodsStartAmounts[good] == goodsEndAmounts[good])
        print('Blieb bei <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' von allen Gütern)</small>');
    else
        print('Veränderte sich von <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' von allen Gütern)</small> auf <b>' + goodsEndAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_end'] + " von allen Gütern)</small>, das ist <b>" + goodsPercentages[good + '_diff'] + '</b> von der anfänglichen ' + goodsStartAmounts[good]);
};
