/*****************************

            UTILITY

*****************************/

(function() {
    generateBoardStyle();
    document.querySelector('section.board').addEventListener("click", function(e){e.stopPropagation();clearSelects()});
    document.querySelector('section.board').addEventListener("wheel", function(e){
        e.stopPropagation();
        this.scrollLeft -= e.wheelDelta / 2;
    });
})();

function ascii(str) {
	return str.replace(/[^\x00-\x7F]/g, "").replace(' ','_');
}

function findParent(el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}

function readableTime(timeInSeconds) {
	var prefix = '';
	if (timeInSeconds < 0) {
		timeInSeconds *= -1;
		prefix = '-'
	}
	var minutes = Math.round(Math.floor(timeInSeconds / 60));
	var seconds = Math.round(timeInSeconds - minutes * 60);
	return prefix + minutes + ':' + leadingZero(seconds);
}

function leadingZero(value) {
    return ('0' + value).slice(-2);
}

function updateTaskInfo(id) {
    var taskInfo = document.querySelector('section.infobar .taskInfo');
    var task = ResData.findTask(id);
    if(!id || !task)
    {
        ResData.selectedTask = '';
        if (!taskInfo.classList.contains('hidden')) {
            taskInfo.className += ' hidden';
        }
        updateWorkers();
        return;
    }

    ResData.selectedTask = id;
    updateWorkers();

    taskInfo.querySelector('.name').innerHTML = task.name;
    taskInfo.querySelector('.time').innerHTML = readableTime(task.rewards.base.t);

    taskInfo.className = 'taskInfo ' + ResData.taskTypesRev[task.type];
    taskInfo.querySelector('.desc').innerHTML = task.rewards.base.d;
    taskInfo.querySelector('.reward').innerHTML = task.rewards.base.r;
    if(task.rewards.bonus !== undefined) {
        taskInfo.querySelector('.bonus_time').innerHTML = readableTime(task.rewards.bonus.t);
        taskInfo.querySelector('.bonus_reward').innerHTML = task.rewards.bonus.r;
        taskInfo.querySelector('.bonus_desc').innerHTML = task.rewards.bonus.d;
        if(task.rewards.bonus.t > 0) {
            taskInfo.querySelector('.bonus_reward').className = 'bonus_reward';
        } else {
            taskInfo.querySelector('.bonus_reward').className = 'bonus_reward missed';
        }
    } else {
        taskInfo.querySelector('.bonus_time').innerHTML = '';
        taskInfo.querySelector('.bonus_reward').innerHTML = '';
        taskInfo.querySelector('.bonus_desc').innerHTML = '';
    }
    
    var prog_p = task.planAmount;
    var prog_i = (prog_p + task.implementAmount);
    var prog_t = (prog_i + task.testAmount);
    var prog_style = 'background-image: linear-gradient(to right,';
    prog_style += '#0D0, #0D0 ' + (prog_p-1) + '%, #0DD ' + prog_p;
    prog_style += '%, #0DD ' + (prog_i-1) + '%, #DD0 ' + prog_i;
    prog_style += '%, #DD0 ' + (prog_t-1) + '%, #FFF4 ' + prog_t;
    prog_style += '%);';
    taskInfo.querySelector('.progress').style = prog_style;    
    var prog_status = (task.planProgress + task.implementProgress + task.testProgress);
    taskInfo.querySelector('.progress_state').style = 'width: ' + prog_status + '%';

    if (taskInfo.classList.contains('hidden')) {
        taskInfo.className = taskInfo.className.replace(' hidden', '');
    }
}

function updateWorkers() {
    Object.keys(ResData.workers).forEach( function(key) {
        ResData.workers[key].updateDOM();
    });
}

function clearSelects() {
    document.querySelectorAll('.task.selected').forEach(function (item, index) {
        item.className = item.className.replace(' selected', '');
    });
    updateTaskInfo();
}

function generateBoardStyle() {
    var style = document.createElement('style');
    style.type = 'text/css';
    var s = 'section.board {\n';
    var s2= '';
    var r1 = '"';
    var r2 = '" .';
    var r3 = '"';
    var re = '" .'
    var rf = '/ ';
    s += 'grid: ';
    for(var i=0; i<=30; ++i)
    {
        r1 += 'i'+ (i*3) + ' i' + (i*3) + ' i' + (i*3) + '  .';
        r2 += '  . i'+ (i*3 + 1) + ' i' + (i*3 + 1) + ' i' + (i*3 + 1);
        r3 += 'i'+ (i*3 + 2) + ' i' + (i*3 + 2) + ' i' + (i*3 + 2) + '  .';
        re += '  .  .  .  .';
        rf += ' 10vh 8vh 10vh 8vh';
        
        s2 += 'section.board .task:nth-of-type(' + (i*3 + 1) + ') {grid-area: i' + (i*3) + ';}\n';
        s2 += 'section.board .task:nth-of-type(' + (i*3 + 2) + ') {grid-area: i' + (i*3 + 1) + ';}\n';
        s2 += 'section.board .task:nth-of-type(' + (i*3 + 3) + ') {grid-area: i' + (i*3 + 2) + ';}\n';
    }
    r1 += '  ." 24vh\n';
    r2 += '" 24vh\n';
    r3 += '  ." 24vh\n';
    re += '" 3vh\n';
    rf += ' 10vh;\n';
    s += r1 + re + r2 + re + r3 + re + rf + '}\n';
    style.innerHTML = s + s2;
    document.getElementsByTagName('head')[0].appendChild(style);
}

function update_numbers() {
    if(ResData.playerInfo.points != ResData.playerInfo.points_ui) {
        if(ResData.playerInfo.points_ui < ResData.playerInfo.points) {
            if(ResData.playerInfo.points_ui + 200 < ResData.playerInfo.points) { ResData.playerInfo.points_ui += 100; }
            else if(ResData.playerInfo.points_ui + 20 < ResData.playerInfo.points) { ResData.playerInfo.points_ui += 10; }
            else { ResData.playerInfo.points_ui++; }
        } else if(ResData.playerInfo.points_ui > ResData.playerInfo.points) {
            if(ResData.playerInfo.points_ui - 200 > ResData.playerInfo.points) { ResData.playerInfo.points_ui -= 100; }
            else if(ResData.playerInfo.points_ui - 20 > ResData.playerInfo.points) { ResData.playerInfo.points_ui -= 10; }
            else { ResData.playerInfo.points_ui--; }
        }
        document.querySelector('.points .value span').innerHTML = ResData.playerInfo.points_ui;
    }
    if(ResData.playerInfo.time != ResData.playerInfo.time_ui) {
        if(ResData.playerInfo.time_ui < ResData.playerInfo.time) {
            if(ResData.playerInfo.time_ui + 20 < ResData.playerInfo.time) { ResData.playerInfo.time_ui += 10; }
            else { ResData.playerInfo.time_ui++; }
        } else if(ResData.playerInfo.time_ui > ResData.playerInfo.time) {
            if(ResData.playerInfo.time_ui - 20 > ResData.playerInfo.time) { ResData.playerInfo.time_ui -= 10; }
            else { ResData.playerInfo.time_ui--; }
        }
        document.querySelector('.time .value span').innerHTML = readableTime(ResData.playerInfo.time_ui);
    }
}
