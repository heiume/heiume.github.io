const mapData = {
  minX: 1,
  maxX: 100,
  minY: 1,
  maxY: 100,
  blockedSpaces: {
  },
};

// Options for Player Colors... these are in the same order as our sprite sheet
const playerEar = ["1", "2", "3", "4"];
const playerHead = ["1", "2", "3", "4"];

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getKeyString(x, y) {
  return `${x}x${y}`;
}

//Name
function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
  ]);
  const animal = randomFromArray([
    "CAT",
  ]);
  return `${prefix} ${animal}`;
}


function isSolid(x, y) {

  const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  )
}

function randomPosX() {
  return Math.floor((Math.random() * 100) + 1);
}
function PosY(){
  return 38;
}

function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: randomPosX(), y: 38 },
  ]);
}

(function () {
  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};

  const playerNameInput = document.querySelector("#player-name");
  const gameContainer = document.querySelector(".game-container");


  function handleArrowPress(xChange=0, yChange=0) {
    const newX = players[playerId].x + xChange;
    const newY = players[playerId].y + yChange;
    if (!isSolid(newX, newY)) {
      //move to the next space
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange === 1) {
        players[playerId].direction = "right";
      }
      if (xChange === -1) {
        players[playerId].direction = "left";
      }
      playerRef.set(players[playerId]);
      
    }
  }


  function initGame() {

    new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0))
    new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0))


    const allPlayersRef = firebase.database().ref(`players`);

    allPlayersRef.on("value", (snapshot) => {
      //player join and quit occurs
      players = snapshot.val() || {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];

        // Now update the DOM
        el.querySelector(".Character_name").innerText = characterState.name;
        const left = 16 * characterState.x + "px";
        const bottom = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${bottom}, 0)`;
      })
    })
    allPlayersRef.on("child_added", (snapshot) => {
      //player tree
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      //player Img
      characterElement.classList.add("Charater", "grid-cell");
      if (addedPlayer.id === playerId) {
        characterElement.classList.add("you");
      }
      characterElement.innerHTML = (`
      <div class="Character_shadow grid-cell"></div>
      <div class="Character_sprite grid-cell"></div>
      <div class="Character_name-container">
        <span class="Character_name"></span>
        <span class="Character_coins">0</span>
      </div>
      <div class="Character_you-arrow"></div>
    `);
      playerElements[addedPlayer.id] = characterElement;


      //Init State
      characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
      `//ear
      characterElement.setAttribute("data-ear",).addedPlayer.ear;
      //face
      characterElement.setAttribute("data-ear",).addedPlayer.head;`
      //pos
      const left = 16 * addedPlayer.x + "px";
      const bottom = 16 * addedPlayer.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${bottom}, 0)`;
      //show on ground
      gameContainer.appendChild(characterElement);

    })
    //Remove character DOM element after they leave
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    })

    //Updates player name with text input
    playerNameInput.addEventListener("change", (e) => {
      const newName = e.target.value || createName();
      playerNameInput.value = newName;
      playerRef.update({
        name: newName
      })
    })
    //
  }

  firebase.auth().onAuthStateChanged((user) => {

    console.log(user)
    if (user) {
      //You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const name = createName();
      playerNameInput.value = name;

      `eartype: randomFromArray(playerEar),
        bodytype: randomFromArray(playerBody),`

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        name,
        x,
        y,
      })

      //Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();
      //Begin the game now that we are signed in
      initGame();
    } else {
      //You're logged out.
    }
  })

  firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    console.log(errorCode, errorMessage);
  });


})();
