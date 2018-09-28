/*****************************

            TASK

*****************************/

class ResWorker {
	constructor(names, xp, stamina) {
		this.id = 'worker-' + ascii(names[0]).slice(0, 1) + '-' + Object.keys(ResData.workers).length;
		this.names = names;
		this.xp = xp;
		this.stamina = stamina;
		this.lastLVL = -1;
        this.currentTask = false;
		ResData.workers[this.id] = this;
	}

	setStamina(stamina) {
		if (stamina > 100) {
			this.stamina = 100;
		} else if (stamina < 0) {
			this.stamina = 0;
		} else {
			this.stamina = stamina;
		}
		this.updateDOM();
	}

	setXp(skill) {
		if (skill < 10) {
			this.xp = skill;
		} else {
			this.xp = 10;
		}
		this.updateDOM();
	}
    
    createDOM() {
        var wrapperDiv = document.createElement('div');
        wrapperDiv.className = "worker";
        wrapperDiv.setAttribute('id', this.id);

        var nameSpan = document.createElement('span');
        nameSpan.className = "name";
        nameSpan.innerHTML = this.names[0];
        wrapperDiv.append(nameSpan);
        var yesSpan = document.createElement('span');
        yesSpan.className = "yes";
        yesSpan.addEventListener("click", function(e){e.stopPropagation();ResData.findWorker(this.parentElement.id).addTask();});
        wrapperDiv.append(yesSpan);
        var noSpan = document.createElement('span');
        noSpan.className = "no";
        noSpan.addEventListener("click", function(e){e.stopPropagation();ResData.findWorker(this.parentElement.id).removeTask();});
        wrapperDiv.append(noSpan);
        var staminaSpan = document.createElement('span');
        staminaSpan.className = "stamina";
        wrapperDiv.append(staminaSpan);
        var iconSpan = document.createElement('span');
        iconSpan.className = "icon";
        wrapperDiv.append(iconSpan);
        var xpDiv = document.createElement('div');
        xpDiv.className = "xp";
            var xp_stateDiv = document.createElement('div');
            xp_stateDiv.className = "state";
            xpDiv.append(xp_stateDiv);
            var xp_valDiv = document.createElement('div');
            xp_valDiv.className = "value";
            xpDiv.append(xp_valDiv);
        wrapperDiv.append(xpDiv);
        this.updateDOM(wrapperDiv);
        return wrapperDiv;
    }

    getStaminaColor() {
        var red = 0;
        var green = 0;
        var blue = 0;
        if (this.stamina >= 50) {
            red = Math.round((255 / 50) * (100 - this.stamina));
            green = 255;
        } else {
            red = 255;
            green = Math.round((255 / 50) * (this.stamina));
        }
        return "rgb(" + red + "," + green + "," + blue + ")";
    }

    updateDOM(wrapperDiv) {
        if (typeof wrapperDiv == "undefined") {
            wrapperDiv = document.getElementById(this.id);
            if (wrapperDiv == null) {
                console.log("Cannot update! '" + this.id + "' not found.");
                return false;
            }
        }
        wrapperDiv.querySelector(".xp > .state").style.width = ((this.xp) * 10) + '%';
        wrapperDiv.querySelector(".xp > .value").innerHTML = Math.floor(this.xp);
        var currentLVL = ResData.playerInfo.level - 1;
        if (this.lastLVL != currentLVL) {
            this.lastLVL = currentLVL;
            var name = this.names[currentLVL];
            wrapperDiv.querySelector(".name").innerHTML = name;
        }
        var staminaValueDiv = wrapperDiv.querySelector(".stamina");
        staminaValueDiv.style.height = this.stamina + "%";
        staminaValueDiv.style.backgroundColor = this.getStaminaColor();
        
        var task = ResData.findTask(ResData.selectedTask);
        if(this.currentTask === ResData.selectedTask
          && task
          && !task.finished)
        {
            wrapperDiv.querySelector(".no").className = 'no avail';
            wrapperDiv.querySelector(".yes").className = 'yes';
        } else if(this.currentTask === false
                 && ResData.selectedTask != ''
                 && !task.finished
                 && task.type != ResData.taskTypes.Missed) {
            wrapperDiv.querySelector(".yes").className = 'yes avail';
            wrapperDiv.querySelector(".no").className = 'no';
        } else {
            wrapperDiv.querySelector(".yes").className = 'yes';
            wrapperDiv.querySelector(".no").className = 'no';
        }
        if(this.currentTask) {
            if(!wrapperDiv.className.includes(' working')) {
                wrapperDiv.className += ' working';
            }
        } else {
            if(wrapperDiv.className.includes(' working')) {
                wrapperDiv.className = wrapperDiv.className.replace(' working', '');
            }
        }

        return true;
    }
    
    addTask() {
        if(this.currentTask === false && ResData.selectedTask != '') {
            this.currentTask = ResData.selectedTask;
        }
        this.updateDOM();
    }

    removeTask() {
        if(this.currentTask === ResData.selectedTask) {
            this.currentTask = false;
        }
        this.updateDOM();
    }
    
    taskFinished() {
        this.currentTask = false;
        this.updateDOM();
    }

}