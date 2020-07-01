//Tabs
var pomodoros = document.getElementById('pomodoros');
var shortBreak = document.getElementById('shortBreak');
var longBreak = document.getElementById('longBreak');
var settings = document.getElementById('settings');

//Buttons
var startButton = document.getElementById('startButton');
var resetButton = document.getElementById('resetButton');
var stopButton = document.getElementById('stopButton');
var saveButton = document.getElementById('saveButton');
var clearButton = document.getElementById('clearButton');
var clearTasksButton = document.getElementById('clearTasksButton');

var timeLeftDisplay = document.getElementById("timeLeft");

//Timer/Setting Displays
var timerDisplay = document.getElementById('timerDisplay');
var settingsDisplay = document.getElementById('settingsDisplay');

//Inputs
var pomodoroInput = document.getElementById("pomodoroInput");
var shortBreakInput = document.getElementById("shortBreakInput");
var longBreakInput = document.getElementById("longBreakInput");
var sliderValue = document.getElementById("sliderValue");
var autoStartRoundsInput = document.getElementById("autoStartRoundsInput");
var tickSoundInput = document.getElementById("tickSoundInput");
var darkModeToggle = document.getElementById("darkModeToggle");
var notificationSoundInput = document.getElementById("notificationSoundInput");
var notificationTextInput = document.getElementById("notificationTextInput");
var backgroundMusicToggleButton = document.getElementById("backgroundMusicToggleButton");
var backgroundMusicOptions = document.getElementById("backgroundMusicOptions");
var longBreakIntervalInput = document.getElementById('longBreakIntervalInput');


var jumbotron = document.querySelector(".jumbotron");
var locationUpdateLog = document.getElementById("locationUpdateLog");
var listOfTasks = document.getElementById('listOfTasks');

var progressValue = document.querySelector(".progress-value");
var notificationTime;
var titleDisplayText;
var currentTab;
var currentStartTime;
var currentEndTime;
var currentDate;

var allPossibleModes = {
  "pomodoro": {
    input: pomodoroInput,
    defaultTime: 25,
    localStorage: localStorage.currentPomodoroValue,
    sound: new Howl({
      src: ['assets/sounds/alert-work.mp3']
    })
  },

  "long break": {
    input: longBreakInput,
    defaultTime: 20,
    localStorage: localStorage.currentLongBreakValue,
    sound: new Howl({
      src: ['assets/sounds/alert-long-break.mp3']
    })
  },
  "short break": {
    input: shortBreakInput,
    defaultTime: 5,
    localStorage: localStorage.currentShortBreakValue,
    sound: new Howl({
      src: ['assets/sounds/alert-short-break.mp3']
    })
  }
};

// Ticking Sound
tick = new Howl({
  src: ['assets/sounds/tick.mp3'],
  volume:2
});

notification = new Howl({
  src: ['assets/sounds/notification-bell.mp3']
});


//Background Music
allBackgroundMusic = {
  "Campfire": new Howl({
    src: ['assets/sounds/background_music/Campfire.mp3'],
    volume:0.1,
    loop:true
  }),
  "Forest":new Howl({
    src: ['assets/sounds/background_music/Forest.mp3'],
    volume:0.1,
    loop:true
  }),
  "Ocean":new Howl({
    src: ['assets/sounds/background_music/Ocean.mp3'],
    volume:0.1,
    loop:true
  }),
  "Rain":new Howl({
    src: ['assets/sounds/background_music/Rain.mp3'],
    volume:0.1,
    loop:true
  }),
  "Windy Desert":new Howl({
    src: ['assets/sounds/background_music/Windy_Desert.mp3'],
    volume:0.1,
    loop:true
  })
}

init();
function init(){
  currentTab = "pomodoro";
  pomodoroTabDisplay();
  contentDisplay();
  makeButtonsInactive();
  pomodoros.style.fontSize = "1.15rem";
  // ===================Ticking Sound============================
  if(localStorage.tickSoundInputValue === "true"){
    tickSoundInput.checked = localStorage.tickSoundInputValue;
  }
  else{
    tickSoundInput.checked = false;
  }
  resetButtonSize();
  modesList = ["pomodoro", "short break", "long break"]
  for(var i=0;i<modesList.length;i++){
    if(allPossibleModes[modesList[i]].localStorage){
      allPossibleModes[modesList[i]].input.value = allPossibleModes[modesList[i]].localStorage;
    }
    else{
      allPossibleModes[modesList[i]].input.value = allPossibleModes[modesList[i]].defaultTime;
    }
  }

  //=================Notification===================
  if(localStorage.notificationSoundInputValue === "true"){
    notificationSoundInput.checked = localStorage.notificationSoundInputValue;
  }
  else{
    notificationSoundInput.checked = false;
  }

  if(localStorage.notificationTextInputEnableDisable === "true"){
    notificationTextInput.disabled = localStorage.notificationTextInputEnableDisable;
  }
  else{
    notificationTextInput.disabled = false;
  }

  if(localStorage.notificationTextInputValue){
    notificationTextInput.value = localStorage.notificationTextInputValue;
  }
  else{
    notificationTextInput.value = 1;
  }
  // ===================================Background Music=========================
  if(localStorage.backgroundMusicToggleButtonValue === "true"){
    backgroundMusicToggleButton.checked = localStorage.backgroundMusicToggleButtonValue;
  }
  else{
    backgroundMusicToggleButton.checked = false;

  }
  if(localStorage.backgroundMusicOptionsEnableDisable === "true"){
    backgroundMusicOptions.disabled = localStorage.backgroundMusicOptionsEnableDisable;
  }
  else{
    backgroundMusicOptions.disabled = false;
  }
  if(localStorage.backgroundMusicOptionsValue){
    backgroundMusicOptions.value = localStorage.backgroundMusicOptionsValue;
  }
  else{
    backgroundMusicOptions.value = "Rain";
  }
  // ===============================Dark Mode====================================
  if(localStorage.darkModeToggleValue === "true"){
    darkModeToggle.checked = localStorage.darkModeToggleValue;
    darkMode();
  }
  else{
    darkModeToggle.checked = false;
  }
  // ===============================Logging=============================================
  if (localStorage.logContents !== undefined){
    if (localStorage.logContents.indexOf("tr") === -1){
      showNoDataLoggedText();
    }
    else{
      locationUpdateLog.innerHTML = localStorage.logContents;
      removeNoDataLoggedText();
    }
  }
  else{
  }
  // ============================Todo list===========================================
  if (localStorage.todoContents !== undefined){
    if (localStorage.todoContents.indexOf("li") === -1){
      showNoTaskTodayText();
    }
    else{
      //List is not empty
      listOfTasks.innerHTML = localStorage.todoContents;
      removeNoTaskTodayText();
    }
  }
  else{
  }
  // =====================Long Break Interval==========================================
  if (localStorage.longBreakInterval !== undefined){
    longBreakIntervalInput.value = localStorage.longBreakInterval;
  }
  else{
    longBreakIntervalInput.value = 4;
  }
  if (localStorage.sliderValue != undefined){
    sliderValue.innerHTML = localStorage.sliderValue;
  }
  else{
    sliderValue.innerHTML = 4;
  }
  // ======================Auto Start Input===================================
  if(localStorage.autoStartRoundsInputValue === "true"){
    autoStartRoundsInput.checked = localStorage.autoStartRoundsInputValue;
  }
  else{
    autoStartRoundsInput.checked = false;
  }
}
pomodoros.addEventListener("click",function(){
  currentTab = "pomodoro";
  pomodoroTabDisplay();
  contentDisplay();
  resetTimer();
  makeButtonsInactive();
  resetButtonSize();
  stopBackGroundMusic();
});

shortBreak.addEventListener("click",function(){
  currentTab = "short break";
  shortBreakTabDisplay();
  contentDisplay();
  resetTimer();
  makeButtonsInactive();
  resetButtonSize();
  stopBackGroundMusic();
});

longBreak.addEventListener("click",function(){
  currentTab = "long break";
  longBreakTabDisplay();
  contentDisplay();
  resetTimer();
  makeButtonsInactive();
  resetButtonSize();
  stopBackGroundMusic();
});


//Function that takes 1 away from timeLeft every 1000ms/1s
var updateSeconds = null;
function countDown(){
    playBackGroundMusic();
    currentStartTime = getTime();
    currentDate = getDate();
    updateSeconds = setInterval(function(){
    timeLeft-=1;
    if(timeLeft>=1){
      timeLeftDisplay.innerHTML = secondsToMinutes(timeLeft);
      titleTimeDisplay();
      document.title = secondsToMinutes(timeLeft) + " - " + titleDisplayText;
      progressDisplay();

      playTickSound();
      playEndingNotification();

    }
    else{
      timeLeft=0;
      timeLeftDisplay.innerHTML = secondsToMinutes(timeLeft);
      titleTimeDisplay();
      document.title = secondsToMinutes(timeLeft) + " - " + titleDisplayText;
      clearInterval(updateSeconds);
      allPossibleModes[currentTab].sound.play();
      stopBackGroundMusic();
      currentEndTime = getTime();
      addDataToLog();
      startNextRound();
    }
  },1000);
}


function resetTimer(){
  clearInterval(updateSeconds);
  timerRunning = false;
  //If user entered some input
  if(allPossibleModes[currentTab].localStorage){
    //Then use the input the user enters
    timeLeft = minutesToSeconds(allPossibleModes[currentTab].localStorage);
  }
  else{
    //Else use default input
    timeLeft = minutesToSeconds(allPossibleModes[currentTab].defaultTime);
  }
  //Display input
  timeLeftDisplay.innerHTML = secondsToMinutes(timeLeft);
  document.title = "PomodoroTimers";
  progressDisplay();
  startButton.classList.remove("active");
  stopButton.classList.remove("active");
  resetButton.classList.add("active");
}

function stopTimer(){
  clearInterval(updateSeconds);
  timerRunning = false;
  startButton.classList.remove("active");
  stopButton.classList.add("active");
  resetButton.classList.remove("active");
}
//Buttons
var timerRunning = false;
startButton.addEventListener('click',function(){
  if (timerRunning===false){
    timerRunning = true;
    countDown();
    startButton.classList.add("active");
    stopButton.classList.remove("active");
    resetButton.classList.remove("active");
  }
  startButton.style.fontSize = "1.3rem";
  stopButton.style.fontSize = "1.25rem";
  resetButton.style.fontSize = "1.25rem";

});
resetButton.addEventListener('click',function(){
  resetTimer();
  startButton.style.fontSize = "1.25rem";
  stopButton.style.fontSize = "1.25rem";
  resetButton.style.fontSize = "1.3rem";
  stopBackGroundMusic();

});
stopButton.addEventListener('click',function(){
  stopTimer();
  startButton.style.fontSize = "1.25rem";
  stopButton.style.fontSize = "1.3rem";
  resetButton.style.fontSize = "1.25rem";
  stopBackGroundMusic();
});
saveButton.addEventListener('click',function(){
  if(currentTab==="pomodoro"){
    pomodoroTabDisplay();
  }
  else if(currentTab==="short break"){
    shortBreakTabDisplay();
  }
  else if(currentTab==="long break"){
    longBreakTabDisplay();
  }
  resetButtonSize();
});

function resetButtonSize(){
  startButton.style.fontSize = "1.25rem";
  stopButton.style.fontSize = "1.25rem";
  resetButton.style.fontSize = "1.25rem";
}
function pomodoroTabDisplay(){
  // Make tabs active
  pomodoros.classList.add("active");
  shortBreak.classList.remove("active");
  longBreak.classList.remove("active");

  //Make tabs text larger
  pomodoros.style.fontSize = "1.15rem";
  shortBreak.style.fontSize = "1.1rem";
  longBreak.style.fontSize = "1.1rem";
}
function shortBreakTabDisplay(){
  // Make tabs active
  pomodoros.classList.remove("active");
  shortBreak.classList.add("active");
  longBreak.classList.remove("active");
  //Make tabs text larger
  pomodoros.style.fontSize = "1.1rem";
  shortBreak.style.fontSize = "1.15rem";
  longBreak.style.fontSize = "1.1rem";
}
function longBreakTabDisplay(){
  // Make tabs active
  pomodoros.classList.remove("active");
  shortBreak.classList.remove("active");
  longBreak.classList.add("active");
  //Make tabs text larger
  pomodoros.style.fontSize = "1.1rem";
  shortBreak.style.fontSize = "1.1rem";
  longBreak.style.fontSize = "1.15rem";
}
//Content Display
function contentDisplay(){
  if(allPossibleModes[currentTab].localStorage){
    timeLeft = minutesToSeconds(allPossibleModes[currentTab].localStorage);
  }
  else{
    timeLeft = minutesToSeconds(allPossibleModes[currentTab].defaultTime);
  }
  timeLeftDisplay.innerHTML = secondsToMinutes(timeLeft);
}
//When input is updated
pomodoroInput.addEventListener("change", function(){
  localStorage.currentPomodoroValue = pomodoroInput.value;
  allPossibleModes["pomodoro"].localStorage = localStorage.currentPomodoroValue;
  pomodoroInput.value = localStorage.currentPomodoroValue;
  contentDisplay();
})
shortBreakInput.addEventListener("change", function(){
  localStorage.currentShortBreakValue = shortBreakInput.value;
  allPossibleModes["short break"].localStorage = localStorage.currentShortBreakValue;
  shortBreakInput.value = localStorage.currentShortBreakValue;
  contentDisplay();
})
longBreakInput.addEventListener("change", function(){
  localStorage.currentLongBreakValue = longBreakInput.value;
  allPossibleModes["long break"].localStorage = localStorage.currentLongBreakValue;
  longBreakInput.value = localStorage.currentLongBreakValue;
  contentDisplay();
})


function titleTimeDisplay(){
  if (currentTab==="pomodoro"){
    titleDisplayText = "Time to Work!";
  }
  else{
    titleDisplayText = "Time for a Break";
  }
}

function makeButtonsInactive(){
  startButton.classList.remove("active");
  stopButton.classList.remove("active");
  resetButton.classList.remove("active");
}
//=================Notificiation, Ticking Sounds and Background Music=======================
notificationSoundInput.addEventListener("change", function(){
  if (notificationSoundInput.checked === true){
    notificationTextInput.disabled = false;
  }
  if (notificationSoundInput.checked === false){
    notificationTextInput.disabled = true;
  }
  localStorage.notificationSoundInputValue = notificationSoundInput.checked;
  localStorage.notificationTextInputEnableDisable = notificationTextInput.disabled;
})
notificationTextInput.addEventListener("change", function(){
  localStorage.notificationTextInputValue = notificationTextInput.value;
})

backgroundMusicToggleButton.addEventListener("change", function(){
  if (backgroundMusicToggleButton.checked === true){
    backgroundMusicOptions.disabled = false;
    playBackGroundMusic();
  }
  if (backgroundMusicToggleButton.checked === false){
    backgroundMusicOptions.disabled = true;
    stopBackGroundMusic();
  }
  localStorage.backgroundMusicToggleButtonValue = backgroundMusicToggleButton.checked;
  localStorage.backgroundMusicOptionsEnableDisable = backgroundMusicOptions.disabled;
})
backgroundMusicOptions.addEventListener("change", function(){
  localStorage.backgroundMusicOptionsValue = backgroundMusicOptions.value;
  stopBackGroundMusic();
  playBackGroundMusic();
})

function playTickSound(){
  if (tickSoundInput.checked){
    tick.play();
  }
}
tickSoundInput.addEventListener("change", function(){
  localStorage.tickSoundInputValue = tickSoundInput.checked;
})
function playEndingNotification(){
  notificationTime = notificationTextInput.value;
  if (notificationSoundInput.checked){
      if (timeLeft === Number(minutesToSeconds(notificationTime))){
        notification.play();
      }
    }
}
function playBackGroundMusic(){
  if (backgroundMusicToggleButton.checked){
    if (timerRunning){
      allBackgroundMusic[backgroundMusicOptions.value].play();
    }
  }
}
function stopBackGroundMusic(){
  for (var allSounds in allBackgroundMusic){
    allBackgroundMusic[allSounds].stop();
  }
}
//===========Calculate percentage complete for progress bar================================
var degreeOfCircle;
function progressDisplay(){
  //Get total time in seconds
  var totalMinutes;
  if(allPossibleModes[currentTab].localStorage){
    totalMinutes = minutesToSeconds(allPossibleModes[currentTab].localStorage);
  }
  else{
    totalMinutes = minutesToSeconds(allPossibleModes[currentTab].defaultTime);
  }
  degreeOfCircle = ((totalMinutes-timeLeft)/totalMinutes) * 360;
  if (degreeOfCircle <= 180){
    progressValue.style.backgroundImage = "-webkit-linear-gradient(" + degreeOfCircle + "deg, #ddd 50%, transparent 50%), -webkit-linear-gradient(left, #007bff 50%, #ddd 50%)";
  }
  else{
    progressValue.style.backgroundImage = "-webkit-linear-gradient(left, #007bff 50%, transparent 50%), -webkit-linear-gradient(" + (Number(degreeOfCircle)-180).toString() + "deg, #007bff 50%, #ddd 50%)";
  }
}

//=========================Minutes and Seconds converter==========================================
function secondsToMinutes(s){
  var minutes = Math.floor(s/60);
  var seconds = s%60;
  if (seconds.toString().length===1){
    seconds = "0" + seconds.toString();
  }
  if (minutes.toString().length===1){
    minutes = "0" + minutes.toString();
  }
  return minutes + ":" + seconds.toString();
}

function minutesToSeconds(m){
  var seconds = m*60;
  return seconds;
}
//====================================Dark and Light Modes======================================
darkModeToggle.addEventListener("change", function(){
  if (darkModeToggle.checked){
    darkMode();
  }
  else if (darkModeToggle.checked === false) {
    lightMode();
  }
  localStorage.darkModeToggleValue = darkModeToggle.checked;
});
function darkMode(){
  document.body.style.backgroundColor = "#171717";
  document.getElementById("timeLeft").style.color = "white";
  var modals = document.querySelectorAll(".modal-content");
  for (var i=0;i<modals.length;i++){
    modals[i].style.backgroundColor = "#171717";
  }
  document.querySelectorAll(".notificationText")[0].style.color = "white";
  document.querySelectorAll(".notificationText")[1].style.color = "white";

  document.getElementById("exampleModalLabel").style.color = "hsla(0,0%,100%,.87)";
  document.getElementById("loggingModalLabel").style.color = "hsla(0,0%,100%,.87)";
  document.getElementById("todoModalLabel").style.color = "hsla(0,0%,100%,.87)";
  document.getElementById("logDataTable").classList.add("table-dark");
  document.querySelector('.siteDescription').style.color = "white";
  document.querySelector('#siteFooter').style.color = "white";
  textMuted = document.querySelectorAll(".text-muted");
  for (var i=0;i<textMuted.length;i++){
    textMuted[i].classList.add("textMutedWhite");
  }
  closeModalButton = document.querySelectorAll(".closeButton");
  for (var i=0;i<closeModalButton.length;i++){
    closeModalButton[i].style.color = "white";
  }
  allBackgrounds = document.querySelectorAll(".bg-light");
  for (var i=0;i<allBackgrounds.length;i++){
    allBackgrounds[i].classList.add("darkMode");
  }
  document.querySelector("#navText").style.color = "white";
  sliderValue.style.color = "white";
  document.querySelector(".overlay").style.background = "#171717";
}
function lightMode(){
  document.body.style.backgroundColor = "white";
  document.getElementById("timeLeft").style.color = "black";
  var modals = document.querySelectorAll(".modal-content");
  for (var i=0;i<modals.length;i++){
    modals[i].style.backgroundColor = "white";
  }
  document.getElementById("exampleModalLabel").style.color = "black";
  document.getElementById("loggingModalLabel").style.color = "black";
  document.getElementById("todoModalLabel").style.color = "black";
  document.getElementById("logDataTable").classList.remove("table-dark");
  document.querySelectorAll(".notificationText")[0].style.color = "black";
  document.querySelectorAll(".notificationText")[1].style.color = "black";
  document.querySelector('.siteDescription').style.color = "black";
  document.querySelector('#siteFooter').style.color = "black";
  for (var i=0;i<textMuted.length;i++){
    textMuted[i].classList.remove("textMutedWhite");
  }
  closeModalButton = document.querySelectorAll(".closeButton");
  for (var i=0;i<closeModalButton.length;i++){
    closeModalButton[i].style.color = "black";
  }
  allBackgrounds = document.querySelectorAll(".bg-light");
  for (var i=0;i<allBackgrounds.length;i++){
    allBackgrounds[i].classList.remove("darkMode");
  }
  document.querySelector("#navText").style.color = "black";
  sliderValue.style.color = "black";
  document.querySelector(".overlay").style.background = "#fff";
}
// ================================Get Time and Date=================================================
function getDate(){
  monthList = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var today = new Date();
  var date = today.getDate();
  var month = monthList[today.getMonth()];
  var year = today.getFullYear();
  return date + " " + month + " " + year;
}
function getTime(){
  var amOrPm = ' AM';
  var today = new Date();
  var hours = today.getHours();
  if (Number(hours) > 12){
    amOrPm = ' PM';
    hours = Number(hours) % 12;
  }
  if (Number(hours) === 12){
    amOrPm = ' PM';
  }
  var minutes = today.getMinutes();
  if (minutes.toString().length === 1){
    minutes = "0" + minutes;
  }
  var time = hours + ":" + minutes + amOrPm;
  return time;
}
// ================================Adding date and time to log=================================================
function addDataToLog(){
  var sessionsCol  = document.createElement("th");
  sessionsCol.setAttribute("scope", "row");
  if (currentTab==="pomodoro"){
    var sessionData = document.createTextNode("Focus");
  }
  else if(currentTab==="short break"){
    var sessionData = document.createTextNode("Short Break");
  }
  else if(currentTab==="long break"){
    var sessionData = document.createTextNode("Long Break");
  }

  sessionsCol.appendChild(sessionData);

  var dateCol = document.createElement("td");
  dateData = document.createTextNode(currentDate);
  dateCol.appendChild(dateData);

  var startTimeCol = document.createElement("td");
  data = document.createTextNode(currentStartTime);
  startTimeCol.appendChild(data);

  var endTimeCol = document.createElement("td");
  data = document.createTextNode(currentEndTime);
  endTimeCol.appendChild(data);

  var timeCol = document.createElement("td");
  if (allPossibleModes[currentTab].localStorage){
    data = document.createTextNode(allPossibleModes[currentTab].localStorage);
    timeCol.appendChild(data);
  }
  else{
    data = document.createTextNode(allPossibleModes[currentTab].defaultTime);
    timeCol.appendChild(minutesToSeconds(data));
  }
  var row = document.createElement("tr");
  row.appendChild(sessionsCol);
  row.appendChild(dateCol);
  row.appendChild(startTimeCol);
  row.appendChild(endTimeCol);
  row.appendChild(timeCol);
  row.innerHTML += '<td><input class="form-control" type="text" placeholder="" onchange="storeLogDescription(this)"></td>'
  row.innerHTML += '<td><button type="button" class="close" onclick = "deleteLog(this)" aria-label="Close"><span aria-hidden="true">&times;</span></button></td>';
  locationUpdateLog.appendChild(row);
  storeLogItems();
  removeNoDataLoggedText();
}
// ================================Clear log===================================================
clearButton.addEventListener("click", function(){
  locationUpdateLog.innerHTML = "";
  storeLogItems();
  showNoDataLoggedText();
})
// ===============================Delete log=================================================
function deleteLog(item){
  item.parentNode.parentNode.remove();
  storeLogItems();
  if (logIsEmpty()){
    showNoDataLoggedText();
  }
}
// ===========================Local Storage for Logging==============================================
function storeLogItems(){
  localStorage.logContents = locationUpdateLog.innerHTML;
}
function storeLogDescription(item){
  item.outerHTML = '<td><input class="form-control" type="text" value="'+item.value+'" onchange="storeLogDescription(this)"></td>';
  storeLogItems();

}
// =====================================No logging data text===============================================
function showNoDataLoggedText(){
  document.getElementById('NoDataLoggedText').style.display = "block";
}
function removeNoDataLoggedText(){
  document.getElementById('NoDataLoggedText').style.display = "none";
}
function logIsEmpty(){
  return (localStorage.logContents.indexOf("tr") === -1);
}
//==========================Todo list============================================================
var taskInput = document.getElementById('taskInput');
taskInput.addEventListener("change", function(){
  displayTasks();
  taskInput.value = "";
  storeTasks();
})
var taskItem;
var listOfTasks = document.getElementById('listOfTasks');
function displayTasks(){
  var listItem = document.createElement("li");
  var todo = document.createTextNode(taskInput.value);
  listItem.setAttribute("class", "list-group-item");
  listItem.setAttribute("onclick", "checkedWhenclicked(this)");
  listItem.appendChild(todo);
  listItem.innerHTML +='<td><button type="button" class="close" onclick = "deleteTasks(this)" aria-label="Close"><span aria-hidden="true">&times;</span></button></td>';
  listOfTasks.appendChild(listItem);
  storeTasks();
  removeNoTaskTodayText();
}
function checkedWhenclicked(item){
  item.classList.toggle("done");
  storeTasks();
}
function deleteTasks(item){
  item.parentNode.remove();
  storeTasks();
  if(listIsEmpty()){
    showNoTaskTodayText();
  }
}
clearTasksButton.addEventListener("click", function(){
  listOfTasks.innerHTML = "";
  storeTasks();
  showNoTaskTodayText();
})
// ================================Local storage for todo list==========================================
function storeTasks(){
  localStorage.todoContents = listOfTasks.innerHTML;
}
// ====================================No task Today Text====================================================
function showNoTaskTodayText(){
  document.getElementById('NoTaskTodayText').style.display = "block";
}
function removeNoTaskTodayText(){
  document.getElementById('NoTaskTodayText').style.display = "none";
}
function listIsEmpty(){
  return localStorage.todoContents.indexOf("li") === -1;
}
// ======================================Start Next Rounds===================================================

longBreakIntervalInput.addEventListener("input", function(){
   localStorage.longBreakInterval = Number(longBreakIntervalInput.value);
   localStorage.sliderValue = Number(longBreakIntervalInput.value);
   sliderValue.innerHTML = localStorage.sliderValue;

})
var numberSessions = 0;
function startNextRound(){
  //if not time for long break play short break
    if (currentTab==="pomodoro" && numberSessions === Number(localStorage.longBreakInterval)-1){
      //play long break
      numberSessions = 0;
      currentTab = "long break";
      longBreakTabDisplay();
      contentDisplay();
      resetTimer();
      makeButtonsInactive();
      resetButtonSize();
      stopBackGroundMusic();
      countDown();
    }
    else if(currentTab==="pomodoro"){
      //play short break
      numberSessions += 1;
      currentTab = "short break";
      shortBreakTabDisplay();
      contentDisplay();
      resetTimer();
      makeButtonsInactive();
      resetButtonSize();
      stopBackGroundMusic();
      if (autoStartRoundsInput.checked){
        autoStartTimer();
      }

    }
    else if (currentTab==="short break"){
      //play pomodoros
      currentTab = "pomodoro";
      pomodoroTabDisplay();
      contentDisplay();
      resetTimer();
      makeButtonsInactive();
      resetButtonSize();
      stopBackGroundMusic();
      if (autoStartRoundsInput.checked){
        autoStartTimer();
      }
    }
    else if (currentTab==="long break"){
      //play pomodoros
      currentTab = "pomodoro";
      pomodoroTabDisplay();
      contentDisplay();
      resetTimer();
      makeButtonsInactive();
      resetButtonSize();
      stopBackGroundMusic();
      if (autoStartRoundsInput.checked){
        autoStartTimer();
      }
     }
}
// ==================================Auto Start Next Round=====================================
function autoStartTimer(){
  if (timerRunning===false){
    timerRunning = true;
    countDown();
    startButton.classList.add("active");
    stopButton.classList.remove("active");
    resetButton.classList.remove("active");
  }
  startButton.style.fontSize = "1.3rem";
  stopButton.style.fontSize = "1.25rem";
  resetButton.style.fontSize = "1.25rem";
}

autoStartRoundsInput.addEventListener("change", function(){
  localStorage.autoStartRoundsInputValue = autoStartRoundsInput.checked;
})

// ===========================Scroll Indicator====================================================
window.addEventListener('scroll', moveScrollIndicator);

const scrollIndicatorElt = document.getElementById('scrollIndicator');

const maxHeight = window.document.body.scrollHeight - window.innerHeight;

function moveScrollIndicator(e) {
  const percentage = ((window.scrollY) / maxHeight) * 100;
  scrollIndicatorElt.style.width = percentage + '%';
}
