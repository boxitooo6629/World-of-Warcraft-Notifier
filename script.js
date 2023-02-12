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

const searchingModal = document.querySelector("#searchingModal");
const foundModal = document.querySelector("#foundModal");

let searchQuery = "";
let searchStart = false;

searchingModal.addEventListener("hide.bs.modal", function() {
    searchQuery = "";
    searchStart = false;
});

foundModal.addEventListener("hide.bs.modal", function() {
    document.querySelectorAll("button.active").forEach(function(button) {
        button.classList.remove("active");
    });
});

// function that serves as callaback to event listener whenever a button is clicked.
function onDungeonButtonClick(e) {
    e.preventDefault();
    let element = e.target;

    //  show looking for dungeon modal
    bootstrap.Modal.getOrCreateInstance(searchingModal, {
        keyboard: false,
        backdrop: "static",
    }).show();

    searchQuery = element.textContent;
    searchStart = moment()

    document.querySelectorAll("button.active").forEach(function(button) {
        button.classList.remove("active");
    });
    element.classList.add("active");
}

// function that loops through dungeon list and creates button that with attached event callback
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
function searchChatForDungeon(list, query) {
    let regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\*\*\[.*\]\*\*) (.*)/;
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
// function that gets dungeon list and ...
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
// calling the main function on ready
document.onreadystatechange = main();

function normalizeChatMessages(response) {
    return response.table.rows.map(function(row) {
        return row.c[0].v;
    });
}

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
function pollForChatMessages(cb) {
    fetchChat().then(cb);

    return setInterval(function() {
        fetchChat().then(cb);
    }, 1000);
}
