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
    "Netherweave",
];
//targeting modal elements
const searchingModal = document.querySelector("#searchingModal");
const foundModal = document.querySelector("#foundModal");
//defined search variables and time when user starting searching
let searchQuery = "";
let searchStart = false;
//event that clears the search query and resets the start timer
searchingModal.addEventListener("hide.bs.modal", function() {
    searchQuery = "";
    searchStart = false;
});
//event that fires after the user closes the found modal
foundModal.addEventListener("hide.bs.modal", function() {
    document.querySelectorAll("button.active").forEach(function(button) {
        button.classList.remove("active");
    });
});

// function that serves as a call back to event listener whenever a button is clicked.
function onDungeonButtonClick(e) {
    e.preventDefault();
    let element = e.target;

    //  show looking for dungeon modal
    bootstrap.Modal.getOrCreateInstance(searchingModal, {
        keyboard: false,
        backdrop: "static",
    }).show();
    // set button text to search query and set current time with moment.js
    searchQuery = element.textContent;
    searchStart = moment()
     // if other buttons have active classes we can clear them
    document.querySelectorAll("button.active").forEach(function(button) {
        button.classList.remove("active");
    });
    // set active class to current element
    element.classList.add("active");
}

// function that loops through dungeon list and creates button  with attached event call back
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
 // function that filters message list by query 
function searchChatForDungeon(list, query) {
    // regex that parses message with following format-2023-02-13 00:02:28 **[Mucmephunt]** LFM Tank Nagrand Arena /w
    let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\*\*\[.*\]\*\*) (.*)/;
    //filter results by date and search query
    return list.reduce(function(acc, cur) {
        if (!cur.match(regex)) {
            return acc;
        }
        let [date, username, text] = cur.match(regex).slice(1);
        date = moment.tz(date, "YYYY-MM-DD HH:mm:ss", "Europe/Moscow").local();
        if (date.isAfter(searchStart) && text.includes(query)) {
            acc.push({
                date,
                username,
                text,
            });
        }
        return acc;
    }, []);
}
// this is the main function that setups the app
function main() {
    let list = document.getElementById("dungeon-list");

    pollForChatMessages(function(messagesList) {
        renderChat(messagesList);

        if (searchQuery !== "") {
            let messages = searchChatForDungeon(messagesList, searchQuery);

            if (!messages.length) return

            bootstrap.Modal.getOrCreateInstance(searchingModal).hide();
            let body = foundModal.querySelector(".modal-body");
            let messageContainer = document.createElement("span");

            messageContainer.classList.add("font-monospace", "fs-6");
            messageContainer.textContent = `${messages[0].date.format("YYYY-MM-DD HH:mm:ss")} - ${messages[0].username
                }: ${messages[0].text}`;
            body.innerHTML = "";
            body.append(messageContainer);

            bootstrap.Modal.getOrCreateInstance(foundModal).show();
        }
    });
    // show render buttons 
    listDungeon(list);
    document
        .getElementById("search-input")
        // filter buttons by search term
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
// calling the main function on ready
document.onreadystatechange = main();

function normalizeChatMessages(response) {
    return response.table.rows.map(function(row) {
        return row.c[0].v;
    });
}
// rendering chat 
function renderChat(messages) {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    messages.forEach(function(value) {
        let chatMessage = document.createElement("span");
        chatMessage.classList.add("font-monospace", "fs-6");
        chatMessage.innerText = value;
        chat.append(chatMessage);
    });
}
// fetch function that takes data from google spread sheet and we reformat the data so it's readable
async function fetchChat() {
    try {
        const response = await fetch(
            "https://docs.google.com/spreadsheets/d/1hfz-f1oVve1SFmd84BaBmZbgbGkw0-qiK_xRtutjEPM/gviz/tq"
        );
        if (!response.ok) {
            throw new Error(response.status);
        }
        const text = await response.text();
        return normalizeChatMessages(
            JSON.parse(text.substring(47, text.length - 2))
        );
    } catch (error) {
        console.error("Error:", error);
    }
}
// function when called will set interval that will fetch the data every 1 second
function pollForChatMessages(cb) {
    fetchChat().then(cb);

    return setInterval(function() {
        fetchChat().then(cb);
    }, 1000);
}
