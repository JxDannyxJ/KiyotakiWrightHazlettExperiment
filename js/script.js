
var storageCosts = {};
var persons = [];
var propTypeAccepts = {};
var propTypeNice = {};
var showSingleSteps = true;
var buttonPressed = false;
var typeA = 'Brot';
var typeB = 'Getreide';
var typeC = 'Mehl';

var personTypeAmounts = {};
personTypeAmounts[1] = 0;
personTypeAmounts[2] = 0;
personTypeAmounts[3] = 0;

var goodsStartAmounts = {};
goodsStartAmounts[typeA] = 0;
goodsStartAmounts[typeB] = 0;
goodsStartAmounts[typeC] = 0;

var goodsEndAmounts = {};
goodsEndAmounts[typeA] = 0;
goodsEndAmounts[typeB] = 0;
goodsEndAmounts[typeC] = 0;


function getDecision(yesThreshold){ // true is yes, false is no
    if(yesThreshold == 0)
        return false;
    if(yesThreshold == 1)
        return true;
    return Math.random() <= yesThreshold;
};

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

Person.prototype = {

    roundStart: function(){
        this.pointsBeforeRound = this.points;
    },

    resetPointsDelta: function(){
        this.pointsDelta = 0;
    },

    wantTrade: function(offeredGood){
        return getDecision(propTypeAccepts[this.type + offeredGood]);
    },

    makeConcession: function(){
        return getDecision(propTypeNice[this.type]);
    },

    doTrade: function(incomingGood){
        if(incomingGood == this.consume){
            this.good = this.produce; //=incomingGood
            this.points += consumeBonus;
        }
        else
            this.good = incomingGood;
    },

    payStorage: function(){
        this.points -= storageCosts[this.good];
        this.pointsDelta = this.points - this.pointsBeforeRound;
    },

    getIdStr: function(){
        return this.id < 10 ? '0' + this.id : '' + this.id;
    },

    getDetails: function(){
        return '<i>[Person' + this.getIdStr() + ', type: <b>' + this.type + '</b>, good: <b>' + this.good + '</b>]</i>';
    },

    toString: function(){ //short toString
        return '<i>Person' + this.getIdStr() + '</i>';
    },

    getDeltaPointsStr: function(){
        if(this.pointsDelta == 0)
            return '';
        return '<small>(' + (this.pointsDelta < 0 ? '' + this.pointsDelta : '+' + this.pointsDelta) + ')</small>';
    },

    getStatus: function(){
        return '<i>Person' + this.getIdStr() + ', type: <b>' + this.type + '</b>, good: <b>' + this.good + '</b>, points: <b>' + this.points + '</b>' + this.getDeltaPointsStr() + '</i>';
    }
};


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
    createPersonTypeGroup(amountOfEachType, 1, typeA, typeB);
    createPersonTypeGroup(amountOfEachType, 2, typeB, typeC);
    createPersonTypeGroup(amountOfEachType, 3, typeC, typeA);
    print('</small>', true);
};


function noTrade(){
    return '<font color="red"><b>Nein</b></font>, ';
};

function yesTrade(){
    return '<font color="green"><b>Ja</b></font>, ';
};


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
    print('<b><font size="4" color="green">round ' + roundNumb + '</font></b>', true);
    var indize = [];
    for(var i = 0; i < n; i ++)
        indize.push(i);
    for(var i = 0; i < n / 2; i ++){
        var randIndex = Math.abs(Math.round(Math.random() * indize.length - 0.5));
        var p1 = persons[indize.splice(randIndex, 1)];
        randIndex = Math.abs(Math.round(Math.random() * indize.length - 0.5));
        var p2 = persons[indize.splice(randIndex, 1)];
        encounter(p1, p2);
    };
    for(var i in persons)
        persons[i].payStorage();
    print('<font color="gray">Status am ende der Runde ' + roundNumb + ':</font>', true);
    showStatuses(false);
};

function runRounds(rounds){
    // if (showSingleSteps) {
    //     registerHandler();
    // }
    for(var i = 0; i < rounds; i ++) {
        oneRound(i + 1);
        // if (showSingleSteps) {
        //     waitForIt();
        // }
    }
};

function keydownHandler(e) {
    if (e.keyCode == 13) {  // 13 is the enter key
        buttonPressed = true;
    }
};

function registerHandler() {
    // register your handler method for the keydown event
    if (document.addEventListener) {
        document.addEventListener('keydown', keydownHandler, false);
    }
    else if (document.attachEvent) {
        document.attachEvent('onkeydown', keydownHandler);
    }
}

/**
 *
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


function printGoodPerformance(goodsPercentages, good){
    print();
    print('<font color="green">Marktanteil von <b>' + good + '</b>:</font>');
    if(goodsStartAmounts[good] == goodsEndAmounts[good])
        print('Blieb bei <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' von allen Gütern)</small>');
    else
        print('Veränderte sich von <b>' + goodsStartAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_start'] + ' von allen Gütern)</small> auf <b>' + goodsEndAmounts[good] + '</b> <small>(' + goodsPercentages[good + '_end'] + " von allen Gütern)</small>, das ist <b>" + goodsPercentages[good + '_diff'] + '</b> von der anfänglichen ' + goodsStartAmounts[good]);
};
