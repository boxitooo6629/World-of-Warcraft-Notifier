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