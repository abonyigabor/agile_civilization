/*****************************

            CONFIG

*****************************/

var uTasksNeeded = 14;
var featureCounter = 0;
var diff_multi = 1.0;
var featureList = [
    [ResData.taskTypes.Feature, "Kunyhóépítés", 20, 60, 10, 1.0, {base:{r:100,t:110,d:'Építsünk házat...',s:'house'}, bonus: {r:300,t:30,d:'Ha gyorsan elkészül, többet ér!',s:'house' }}],
    [ResData.taskTypes.Feature, "Kunyhóépítés", 20, 60, 10, 1.0, {base:{r:100,t:110,d:'Építsünk házat...',s:'house'}, bonus: {r:300,t:30,d:'Ha gyorsan elkészül, többet ér!',s:'house' }}],
    [ResData.taskTypes.Feature, "Rádió", 50, 20, 30, 1.0, {base:{r:200,t:100,d:'Jó reggelt Vietnám!',s:'radio'}, bonus: {r:500,t:35,d:'Ha gyorsan elkészül, többet ér!',s:'radio' }}],
    [ResData.taskTypes.Feature, "Rádió", 50, 20, 30, 1.0, {base:{r:200,t:100,d:'Jó reggelt Vietnám!',s:'radio'}, bonus: {r:500,t:35,d:'Ha gyorsan elkészül, többet ér!',s:'radio' }}],
    [ResData.taskTypes.Feature, "Tárcsás telefon", 50, 10, 40, 1.0, {base:{r:250,t:100,d:'Watson jojjon ide, szuksegem van magara (Alexander Graham Bell)',s:'oldtelefon'}, bonus: {r:700,t:15,d:'Ha gyorsan elkészül, többet ér!',s:'oldtelefon' }}],
    [ResData.taskTypes.Feature, "Tárcsás telefon", 50, 10, 40, 1.0, {base:{r:250,t:100,d:'Watson jojjon ide, szuksegem van magara (Alexander Graham Bell)',s:'oldtelefon'}, bonus: {r:700,t:15,d:'Ha gyorsan elkészül, többet ér!',s:'oldtelefon' }}],
    [ResData.taskTypes.Feature, "Képrögzítés", 40, 20, 25, 1.0, {base:{r:300,t:110,d:'Felvegyelek?',s:'oldcamera'}, bonus: {r:900,t:20,d:'Ha gyorsan elkészül, többet ér!',s:'oldcamera' }}],
    [ResData.taskTypes.Feature, "Képrögzítés", 40, 20, 25, 1.0, {base:{r:300,t:110,d:'Felvegyelek?',s:'oldcamera'}, bonus: {r:900,t:20,d:'Ha gyorsan elkészül, többet ér!',s:'oldcamera' }}],
    [ResData.taskTypes.Feature, "Mühold", 40, 20, 25, 1.0, {base:{r:400,t:90,d:'És még mindig mozog, a Föld!',s:'satellite'}, bonus: {r:1200,t:25,d:'Ha gyorsan elkészül, többet ér!',s:'satellite' }}],
    [ResData.taskTypes.Feature, "Mühold", 40, 20, 25, 1.0, {base:{r:400,t:90,d:'És még mindig mozog, a Föld!',s:'satellite'}, bonus: {r:1200,t:25,d:'Ha gyorsan elkészül, többet ér!',s:'satellite' }}],
    [ResData.taskTypes.Feature, "Mobiltelefon", 40, 20, 25, 1.0, {base:{r:400,t:70,d:'Honnan tudtad hogy itt vagyok?',s:'mobile'}, bonus: {r:1200,t:35,d:'Ha gyorsan elkészül, többet ér!',s:'mobile' }}],
    [ResData.taskTypes.Feature, "Mobiltelefon", 40, 20, 25, 1.0, {base:{r:400,t:70,d:'Honnan tudtad hogy itt vagyok?',s:'mobile'}, bonus: {r:1200,t:35,d:'Ha gyorsan elkészül, többet ér!',s:'mobile' }}],
    [ResData.taskTypes.Feature, "Robotkutya", 45, 10, 35, 1.0, {base:{r:500,t:50,d:'Intelligens, kikapcsolhato házikedvenc',s:'robot_pet'}, bonus: {r:2000,t:45,d:'Ha gyorsan elkészül, többet ér!',s:'robot_pet' }}]
    [ResData.taskTypes.Feature, "Robotkutya", 45, 10, 35, 1.0, {base:{r:500,t:50,d:'Intelligens, kikapcsolhato házikedvenc',s:'robot_pet'}, bonus: {r:2000,t:45,d:'Ha gyorsan elkészül, többet ér!',s:'robot_pet' }}]
]

// Bug: bonus: ha elég gyorsan kijavítod, nem veszik észre.
function initTasks() {
    for(var i = 1; i <= uTasksNeeded + 2; ++i) {
        addUnknownTask();
    }
    var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    addTask();
    addTask();
}

function addUnknownTask() {
    var newTask = new ResTask("task", ResData.taskTypes.Unknown, "Még nem elérhető", 0, 0, 0, 3.0, {base:{r:0,t:0,d:'Előbb a többi nyitott feladatot kell elvégezni.'}});
    document.querySelector('.board').append(newTask.createDOM());
}

function addTask() {
    var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    if(uTasks.length < uTasksNeeded) {
        for(var i=uTasks.length; i<=uTasksNeeded; ++i) {
            addUnknownTask();
        }
    }
    if(uTasks.length == 0) {
        var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    }
    var taskToReplace = uTasks[0];
    if(featureCounter >= featureList.length) {
        featureCounter = 0;
        diff_multi += 1.0;
    }
    replaceTaskFromArray(taskToReplace, featureList[featureCounter]);
    ++featureCounter;
}

function replaceTaskFromArray(taskToReplace, a, diff_multi) {
    if(!diff_multi) {
        diff_multi = 1.0;
    }
    taskToReplace.replace(a[0],a[1],a[2],a[3],a[4],a[5] * diff_multi,a[6])
}

function initWorkers() {
    new ResWorker(['Arisztotelész', 'Alfréd', 'Alan'],    2, 100);
    new ResWorker(['Gilgames',      'Graham', 'Grace'],   2, 100);
    new ResWorker(['Ikarosz',       'Ignác',  'Iwatani'], 2, 100);
    new ResWorker(['Laukon',        'Lenoir', 'Larry'],   2, 100);
    new ResWorker(['Euklidesz',     'Edison', 'Edward'],  2, 100);

    Object.keys(ResData.workers).forEach( function(key) {
      document.querySelector('section.infobar > .workers').append(ResData.workers[key].createDOM());
    });
}

