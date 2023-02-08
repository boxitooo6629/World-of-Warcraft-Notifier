const searchInput = document.getElementById("search-input");
const dungeonList = document.getElementById("dungeon-list");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const dungeons = dungeonList.getElementsByTagName("li");

            for (let i = 0; i < dungeons.length; i++) {
                const dungeon = dungeons[i];
                const dungeonName = dungeon.textContent.toLowerCase();

                if (dungeonName.includes(searchTerm)) {
                    dungeon.style.display = "block";
                } else {
                    dungeon.style.display = "none";
                }
            }
        });

const output = document.getElementById("chat-output");
const input = document.getElementById("chat-input");
const submit = document.getElementById("chat-submit");

    submit.addEventListener("click", function() {
        const message = input.value;
        output.innerHTML += `<p>${message}</p>`;
        input.value = "";
    });

// Get the button element
const button = document.querySelector("#myButton");

// Add an event listener to the button
button.addEventListener("click", function() {
  // Create the modal element
  const modal = document.createElement("chat-submit");
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.right = "0";
  modal.style.bottom = "0";
  modal.style.left = "0";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1000";

  // Add the message to the modal
  const message = document.createElement("p");
  message.style.color = "#fff";
  message.textContent = "Please wait we are working hard to find your match";
  modal.appendChild(message);

  // Add the modal to the document
  document.body.appendChild(modal);
});








       // buttom that will save the desired instance and look for the API


const buttonfunction = document.querySelector('button');

submit.addEventListener('click', function() {
  const name = document.querySelector('input').value;
  let channel_id = "1072632166791512176"
  let token = "MTA3MjYzODc3OTAwNjkxNDY2MA.GjC0U0.338479jjWG2NiAZsumrddxbH9LhtF1j9c6En9Y"

fetch(`https://discordapp.com/api/v6/channels/${channel_id}/messages`, {
  method: 'GET',
  headers: new Headers({
    "Authorization": `Bot ${token}`,
    "User-Agent": "MyBot/1.0"
  })
  
})
.then(response => response.json())
    .then(data => {
      // process the data returned from the API
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    })
})

