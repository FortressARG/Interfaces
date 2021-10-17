"use strict";
document.addEventListener("DOMContentLoaded", () => {
  var keyLeft = false;
  var keyRight = false;
  var keyUp = false;
  var keyDown = false;
  var robocop = document.getElementById('robocop');
  var stand=false;
  var space=false
  var situacionY = document.getElementById("robocop").offsetLeft;
    var situacionX = document.getElementById("robocop").offsetTop;
  window.addEventListener("keydown", (e) => {
    stand=false;
    console.log(e.key);
    if (e.key == "ArrowLeft") {
      keyLeft = true;
      keyRight = false;
      keyUp = false;
      keyDown = false;
      robocop.style.left=robocop.style.left+10; 
    } else if (e.key == "ArrowRight") {
      keyRight = true;
      keyLeft = false;
      keyUp = false;
      keyDown = false;
      robocop.style.right= situacionX-220+"px" ; 
    } else if (e.key == "ArrowUp") {
      keyUp = true;
      keyLeft = false;
      keyRight = false;
      keyDown = false;
    } else if (e.key == "ArrowDown") {
      keyDown = true;
      keyLeft = false;
      keyRight = false;
      keyUp = false;
    }else if (e.key == " ") {
      space= true
      keyDown = false;
      keyLeft = false;
      keyRight = false;
      keyUp = false;
    }

  })
  window.addEventListener("keyup", (e) => {
    stand=true;
    keyDown = false;
    keyLeft = false;
    keyRight = false;
    keyUp = false;
    space=false;
  })
  let intervalId = setInterval(function () {
    if (keyLeft) {
      robocop.className = '';
      robocop.classList.add('robocopLeft')
    } else if (keyRight) {
      robocop.className = '';
      robocop.classList.add('robocopRight')
    } else if (keyUp) {
      robocop.className = '';
      robocop.classList.add('robocopUp')
    } else if (keyDown) {
      robocop.className = '';
      robocop.classList.add('robocopDown')
    }else if (stand){
      robocop.className='';
      robocop.classList.add('robocopStand')
    }else if (space){
      robocop.className='';
      robocop.classList.add('robocopShooter')
    }
  }, 50)
})