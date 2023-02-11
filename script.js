// variable that contains all the instances
const dungeonList = [
    "Ragefire Chasm",
    "The Deadmines",
    "Wailing Caverns",
    "Shadowfang Keep",
    "The Stockade",
    "Gnomeregan",
    "The Scarlet Monastery",
    "Razorfen Kraul",
    "Razorfen Downs",
    "Maraudon",
    "Uldaman",
    "Dire Maul",
    "Strathholme",
    "Blackrock Depths",
    "Blackfathom Deeps",
    "Dire Maul",
    "Maraudon",
    "Razorfen Kraul",
    "Razorfen Downs",
    "Uldaman",
    "Zul'Farrak",
];
 // function that calls event bottonclick then prevent any soft bugs. Then create all the instances in html and make a function to all of them.
function onDungeonButtonClick(e) {
    e.preventDefault()
    let element = e.target;
    document.querySelectorAll(".active").forEach(function(button) {
        button.classList.remove("active")
    })
    element.classList.add("active")
}
 // function that loops through all the instances and creates button that has function
function listDungeon(list) {
    for (let i = 0; i < dungeonList.length; i++) {
        let button = document.createElement("button");

        button.type = "button";
        button.className = "list-group-item list-group-item-action";
        button.innerText = dungeonList[i];
        button.addEventListener("click", onDungeonButtonClick);
        list.append(button);
    }
}
 // function that gets dungeon list and ...
function main() {
    let list = document.getElementById("dungeon-list");
    listDungeon(list);
    document
        .getElementById("search-input")
        .addEventListener("input", function(e) {
            let searchTerm = e.target.value;
            let buttonElements = list.getElementsByTagName("button");

            for (let i = 0; i < buttonElements.length; i++) {
                const dungeon = buttonElements[i];
                const dungeonName = dungeon.textContent.toLowerCase();

                if (dungeonName.includes(searchTerm.toLowerCase())) {
                    dungeon.style.display = "block";
                } else {
                    dungeon.style.display = "none";
                }
            }
        });
}
 // calling the function...
document.onreadystatechange = main();



//(fetch API )

const textFileUrl = 'https://docs.google.com/spreadsheets/d/1hfz-f1oVve1SFmd84BaBmZbgbGkw0-qiK_xRtutjEPM/gviz/tq';
let textApp = ""
// Make a GET request to the text file using the fetch method
fetch(textFileUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.text();
  })
  .then(text => {
    // Do something with the text
    textApp = text.substring(47,text.length-2)
   updateChat(getChat(JSON.parse(textApp)))
  })
  .catch(error => {
    console.error('Error:', error);
  });

  function getChat(response){
    return response.table.rows.map(function(row){
    return row.c[0].v
   })
  }
   
  function updateChat(messages) {
  const chat= document.getElementById("chat")
  chat.innerHTML=""
  messages.forEach(function(value){
  let chatMessage = document.createElement("span")
  chatMessage.classList.add(["font-monospace", "fs-6"])
  chatMessage.innerText = value
  chat.append(chatMessage)

  })
  };
  



// const buttonfunction = document.querySelector("button");
// const url = `https://docs.google.com/spreadsheets/d/1hfz-f1oVve1SFmd84BaBmZbgbGkw0-qiK_xRtutjEPM/gviz/tq`
// var headers = {}
   
//     fetch(url).then(function(response) {
    
//         console.log (response.text());
// }).then(function(data) {
//   console.log(data);
// }).catch(function(err) {
//   console.log('Fetch Error :-S', err);
// });


button.addEventListener("click", function(event) {
    // Create the modal element
    const modal = document.createElement("div");
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