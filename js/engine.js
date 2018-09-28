/******************************

            WORKER

******************************/

class ResWorker {
  constructor(names, planLVL, implementLVL, testLVL, stamina) {
    this.id = 'worker-' + ascii(names[0]).slice(0,1) + '-' + Object.keys(ResData.workers).length;
    this.names = names;
    this.planLVL = planLVL;
    this.implementLVL = implementLVL;
    this.testLVL = testLVL;
    this.stamina = stamina;
    this.lastLVL = -1;
    ResData.workers[this.id] = this;
  }

  getTask() {
    var profile = document.querySelector('.profile[for=' + this.id + ']');
    if(!profile) {
        return null;
    }
    var taskDiv = findParent(profile, 'task');
    if(taskDiv) {
      return ResData.findTask(taskDiv.id);
    }
    return null;
  }

  setStamina(stamina) {
    if(stamina > 100) {
        this.stamina = 100;
    } else if(stamina < 0) {
        this.stamina = 0;
    } else {
        this.stamina = stamina;
    }
    this.updateDOM();
  }
  
  setPlan(skill) {
    if(skill < 10) {
      this.planLVL = skill;
    } else {
      this.planLVL = 10;
    }
    this.updateDOM();
  }

  setImplement(skill) {
    if(skill < 10) {
      this.implementLVL = skill;
    } else {
      this.implementLVL = 10;
    }
    this.updateDOM();
  }

  setTest(skill) {
    if(skill < 10) {
      this.testLVL = skill;
    } else {
      this.testLVL = 10;
    }
    this.updateDOM();
  }

  createDOM() {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.className = "worker";
    wrapperDiv.setAttribute('id', this.id);

    var nameDiv = document.createElement('div');
    nameDiv.className = "name";
    nameDiv.innerHTML = this.names[0];
    wrapperDiv.append(nameDiv);
    var staminaDiv = document.createElement('div');
    staminaDiv.className = "stamina";
    var staminaValueDiv = document.createElement('div');
    staminaValueDiv.className = "value";
    staminaDiv.append(staminaValueDiv);
    wrapperDiv.append(staminaDiv);

    var workerDataDiv = document.createElement('div');
    workerDataDiv.className = "workerData";
    var experienceDiv = document.createElement('div');
    experienceDiv.className = "experience";
    ResData.taskStates.forEach(function(item, index){
      var element = document.createElement('div');
      element.className = "experienceElement " + item.name + 'LVL';
      var imgDiv = document.createElement('div');
      imgDiv.className = "icon " + item.name;
      element.append(imgDiv);
      var mainBar = document.createElement('div');
      mainBar.className = "mainProgressBar";
      var progBar = document.createElement('div');
      progBar.className = item.name + 'Progress';
      var progVal = document.createElement('div');
      progVal.className = 'value';
      mainBar.append(progBar);
      mainBar.append(progVal);
      element.append(mainBar)
      experienceDiv.append(element);
    });
    workerDataDiv.append(experienceDiv);

    var profileContainerDiv = document.createElement('div');
    profileContainerDiv.className = "profileContainer";
    profileContainerDiv.setAttribute('for', this.id);
    var profileDiv = document.createElement('div');
    profileDiv.className = "profile";
    profileDiv.setAttribute('for', this.id);
    profileDiv.addEventListener("click", function(e){e.stopPropagation();ResData.findWorker(this.getAttribute('for')).highlight_toggle();});
    var profileNickSpan = document.createElement('span');
    profileNickSpan.className = 'nick';
    profileNickSpan.innerHTML = this.names[0];
    profileDiv.append(profileNickSpan);
    profileContainerDiv.append(profileDiv);
    
    workerDataDiv.append(profileContainerDiv);
    wrapperDiv.append(workerDataDiv);
    wrapperDiv.addEventListener("click", this.highlight_toggle);

    workerDrag.containers.push(wrapperDiv.querySelector('.profileContainer'));
    
    this.updateDOM(wrapperDiv);
    return wrapperDiv;
  }

  getStaminaColor() {
    var red = 0;
    var green = 0;
    var blue = 0;
    if(this.stamina >= 50){
            red = Math.round((255/50) * (100 - this.stamina));
            green = 255;
    } else {
            red = 255;
            green = Math.round((255/50) * (this.stamina));
    }
    return "rgb(" + red + "," +  green + "," +   blue + ")";
  }

  updateDOM(wrapperDiv) {
    if(typeof wrapperDiv == "undefined") {
      wrapperDiv = document.getElementById(this.id);
      if(wrapperDiv == null) {
        console.log("Cannot update! '" + this.id + "' not found.");
        return false;
      }
    }
    wrapperDiv.querySelector(".experienceElement.planLVL .mainProgressBar .planProgress").style.width = ( (this.planLVL) * 10 ) + '%';
    wrapperDiv.querySelector(".experienceElement.planLVL .mainProgressBar .value").innerHTML = Math.floor(this.planLVL);
    wrapperDiv.querySelector(".experienceElement.implementLVL .mainProgressBar .implementProgress").style.width = ( (this.implementLVL) * 10 ) + '%';
    wrapperDiv.querySelector(".experienceElement.implementLVL .mainProgressBar .value").innerHTML = Math.floor(this.implementLVL);
    wrapperDiv.querySelector(".experienceElement.testLVL .mainProgressBar .testProgress").style.width = ( (this.testLVL) * 10 ) + '%';
    wrapperDiv.querySelector(".experienceElement.testLVL .mainProgressBar .value").innerHTML = Math.floor(this.testLVL);
    var currentLVL = ResData.playerInfo.level - 1;
    if(this.lastLVL != currentLVL) {
        this.lastLVL = currentLVL;
        var name = this.names[currentLVL];
        wrapperDiv.querySelector(".name").innerHTML = name;
        var not_working_name = wrapperDiv.querySelector(".nick");
        if(not_working_name) {
            not_working_name.innerHTML = name;
        }
        var working_name = document.querySelector(".profile[for=" + this.id + "] .nick");
        if(working_name) {
            working_name.innerHTML = name;
        }
    }
    var staminaValueDiv = wrapperDiv.querySelector(".stamina .value");
    staminaValueDiv.style.height = this.stamina + "%";
    staminaValueDiv.style.backgroundColor = this.getStaminaColor();
    
    var task = this.getTask();
    if(task && task.finished) {
        if(task.getPhase() == 'phase-D') {
            wrapperDiv.querySelector('.profileContainer').appendChild(document.querySelector('.profile[for=' + this.id + ']'));
        }
    }
    
    return true;
  }

  highlight_toggle() {
    var id = this.id;
    document.querySelectorAll('.worker.highlight, .profile').forEach(function(item, index) {
      if(item.getAttribute('id') != id & item.getAttribute('for') != id) {
        item.className = item.className.replace(' highlight', '');
      }
    });
    var w = document.querySelector('#' + this.id);
    var p = document.querySelector(".profile[for='" + this.id + "'");
    if(w.classList.contains('highlight')) {
      w.className = w.className.replace(' highlight', '');
      p.className = p.className.replace(' highlight', '');
    } else {
      w.className += ' highlight';
      p.className += ' highlight';
    }
  }

  dragStart() {
    var w = document.querySelector('#' + this.id);
    if(!w.classList.contains('dragged')) {
      w.className += ' dragged';
    }
  }

  dragEnd() {
    var w = document.querySelector('#' + this.id);
    if(w.classList.contains('dragged')) {
      w.className = w.className.replace(' dragged', '');
    }
  }

}

var workerDrag = dragula({
  isContainer: function (el) {
    return false; // only elements in drake.containers will be taken into account
  },
  moves: function (el, source, handle, sibling) {
    return true;
  },
  accepts: function (el, target, source, sibling) {
    return ResData.canDropWorker(el.getAttribute('for'), target);
  },
  invalid: function (el, handle) {
    return false; // don't prevent any drags from initiating by default
  },
  direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
  copy: false,                       // elements are moved by default, not copied
  copySortSource: false,             // elements in copy-source containers can be reordered
  revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
  removeOnSpill: false,              // spilling will `.remove` the element, if this is true
  mirrorContainer: document.querySelector('.phases'),    // set the element that gets mirror elements appended
  ignoreInputTextSelection: true     // allows users to select input text, see details below
});

workerDrag.on('over', function (el, container) {
    container.className += ' ex-over';
  }).on('out', function (el, container) {
    container.className = container.className.replace(' ex-over', '');
  }).on('drag', function (el, source) {
    ResData.findWorker(el.getAttribute('for')).dragStart();
  }).on('dragend', function (el) {
    ResData.findWorker(el.getAttribute('for')).dragEnd();
  });


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

function do_core_calc() {
    if(!ResData.playerInfo.ui_active) {
        return;
    }
    var level = ResData.levels[ResData.playerInfo.level - 1];
    if(document.body.className != level.style) {
        document.body.className = level.style;
    }

    Object.keys(ResData.tasks).forEach( function(key) {
        var task = ResData.tasks[key];
        var phaseId = task.getPhase();
        var phase = ResData.taskPhases[phaseId];
        var workers = task.getWorkers();
        if(task.isPhaseReady(phaseId)) {
            workers.forEach( function(worker, index) {
                worker.setStamina(worker.stamina + 0.5);
            });
            
            if(phaseId == 'phase-D' && !ResData.projects[task.project_id] && !document.querySelector('.gu-mirror')) {
                var finished_cnt = 0;
                var reward_sum = 0;
                var projectTasks = ResData.selectTasks(function(t) {
                    if(t.project_id == task.project_id) {
                      if(t.finished && t.getPhase() == 'phase-D') {
                        finished_cnt++;
                        reward_sum += t.reward;
                      }
                      return true;
                    }
                    return false;
                });
                if(finished_cnt == projectTasks.length) {
                    if(ResData.playerInfo.time >= 0) {
                        reward_sum *= (2 * ResData.playerInfo.time) / level.time_limit
                    } else {
                        reward_sum *= 0.5 * (level.time_limit + ResData.playerInfo.time) / level.time_limit;
                    }
                    ResData.playerInfo.points += Math.floor(reward_sum);
                    ResData.projects[task.project_id] = true;
                    var lvlComplete = true;
                    
                    Object.keys(ResData.projects).forEach( function(key) {
                        if(!ResData.projects[key]) {
                            lvlComplete = false;
                        }
                    });
                    if(lvlComplete) {
                        if(ResData.playerInfo.level == 1) {
                            setTimeout(function(){end_stoneAge();}, 1000);
                        }
                        if(ResData.playerInfo.level == 2) {
                            setTimeout(function(){end_ironAge();}, 1000);
                        }
                        if(ResData.playerInfo.level == 3) {
                            setTimeout(function(){end_modernAge();}, 1000);
                        }
                    }
                }
            }
            task.updateDOM();
            return;
        }
        if(workers.length > 0) {
            var fresh_workers = new Array();
            workers.forEach( function(worker, index) {
                if(worker.stamina > 0) {
                    fresh_workers.push(worker);
                }
            });
            if(fresh_workers.length > 0) {
                var skill_sum = 0;
                fresh_workers.forEach( function(worker, index) {
                    worker.setStamina(worker.stamina - (0.4 / fresh_workers.length));
                    var skill = phase.getSkill(worker);
                    skill_sum += Math.floor(skill);
                    skill += 0.03 + 0.02 * (fresh_workers.length - 1);
                    phase.setSkill(worker, skill);
                });
                var progress = phase.getProgress(task);
                progress += skill_sum * fresh_workers.length / (fresh_workers.length + 1)
                phase.setProgress(task, progress);
            }
        }
        task.updateDOM();
    });
    
    Object.keys(ResData.workers).forEach( function(key) {
        var worker = ResData.workers[key];
        if(!worker.getTask()) {
            worker.setStamina(worker.stamina + 1);
        }
    });

    if(ResData.playerInfo.time > -level.time_limit) {
        ResData.playerInfo.time--;
    }
}

function init_game() {
    ResData.playerInfo.ui_interval = setInterval(update_numbers, 80);
    ResData.playerInfo.core_interval = setInterval( do_core_calc, 1000 );
}
var started = false;
function start_game() {
    if(!started) {
        started = true;
        initStoneAgeTasks();
        initStoneAgeWorkers();
        document.querySelector('#popup').className = 'hidden';
        setTimeout(function(){ResData.playerInfo.ui_active = true;}, 1000);
    }
}

function end_stoneAge() {
    started = false;
    document.querySelector('#popup').className = '';
    ResData.tasks = {};
    ResData.projects = {};
    document.querySelectorAll('.task').forEach(function(item) {
        item.remove();
    });
    document.querySelectorAll('.worker').forEach(function(item) {
        item.remove();
    });
    Object.keys(ResData.workers).forEach( function(key) {
        document.querySelector('.phases-infobar .resources').append(ResData.workers[key].createDOM());
    });

    ResData.playerInfo.level = 2;
    do_core_calc();
    var level = ResData.levels[ResData.playerInfo.level - 1];
    ResData.playerInfo.time = level.time_limit;
    ResData.playerInfo.ui_active = false;
}

function start_ironAge() {
    if(!started || true) {
        started = true;
        initIronAgeTasks();
        document.querySelector('#popup').className = 'hidden';
        setTimeout(function(){ResData.playerInfo.ui_active = true;}, 1000);
    }
}

function end_ironAge() {
    started = false;
    document.querySelector('#popup').className = '';
    ResData.tasks = {};
    ResData.projects = {};
    document.querySelectorAll('.task').forEach(function(item) {
        item.remove();
    });
    document.querySelectorAll('.worker').forEach(function(item) {
        item.remove();
    });
    Object.keys(ResData.workers).forEach( function(key) {
        document.querySelector('.phases-infobar .resources').append(ResData.workers[key].createDOM());
    });

    ResData.playerInfo.level = 3;
    do_core_calc();
    var level = ResData.levels[ResData.playerInfo.level - 1];
    ResData.playerInfo.time = level.time_limit;
    ResData.playerInfo.ui_active = false;
}

function start_modernAge() {
    if(!started || true) {
        started = true;
        initModernAgeTasks();
        document.querySelector('#popup').className = 'hidden';
        setTimeout(function(){ResData.playerInfo.ui_active = true;}, 1000);
    }
}

function end_modernAge() {
    started = false;
    document.querySelector('#popup').className = '';
    document.body.className += ' winAge';
    ResData.tasks = {};
    ResData.projects = {};
    document.querySelectorAll('.task').forEach(function(item) {
        item.remove();
    });
    document.querySelectorAll('.worker').forEach(function(item) {
        item.remove();
    });
    Object.keys(ResData.workers).forEach( function(key) {
        document.querySelector('.phases-infobar .resources').append(ResData.workers[key].createDOM());
    });

    ResData.playerInfo.ui_active = false;
}
