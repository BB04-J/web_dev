
let pokemontype = "";
function select_type(type, event) {
    pokemontype = type;
    const buttons = document.querySelectorAll(".type-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
}
async function generatePokemon() {
    const number = parseInt(document.getElementById("pokemonId").value);
    if (number < 1 || number > 151 || isNaN(number)) {
        alert("Please enter a valid Pokemon number (1-151)");
        return;
    }
    if (!pokemontype) {
        alert("Please select a Pokemon type");
        return;
    }
    document.querySelector(".inputscreen").style.display = "none";
    document.querySelector(".card-container").style.display = "block";
    const cardDiv = document.getElementById("card");
    cardDiv.innerHTML = "Loading...";
    let found = 0;
    let id = 1;
    let html = "";
    while (found < number) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        const types = data.types.map(t => t.type.name);
        if (types.includes(pokemontype)) {
            found++;
            const displayType = types[0] || pokemontype;
            const hp = data.stats.find(s => s.stat.name === 'hp')?.base_stat || '—';
            const attack = data.stats.find(s => s.stat.name === 'attack')?.base_stat || '—';
            const defense = data.stats.find(s => s.stat.name === 'defense')?.base_stat || '—';
            html += `
        <div class="card ${displayType}">
            <div class="img-wrap">
                <div class="circle"></div>
                <img src="${data.sprites.front_default}" alt="${data.name}" loading="lazy">
            </div>
            <div class="card-footer">
                <span class="poke-name">${data.name.toUpperCase()}</span>
                <span class="poke-category">${displayType.toUpperCase()}</span>
            </div>
            <div class="card-stats">
                <span class="stat">HP ${hp}</span>
                <span class="stat">ATK ${attack}</span>
                <span class="stat">DEF ${defense}</span>
            </div>
        </div>
        `;
        }
        id++;
    }
    cardDiv.innerHTML = html;
}


function goback() {
    document.querySelector(".card-container").style.display = "none";
    document.querySelector(".inputscreen").style.display = "flex";
    document.getElementById("pokemonId").value = "";
    pokemontype = "";
    document.querySelectorAll(".type-btn").forEach(btn => {
        btn.classList.remove("active");
    });
}


