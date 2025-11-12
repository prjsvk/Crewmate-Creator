document.addEventListener('DOMContentLoaded', function() {
    console.log('Crewmates list page loaded');
    loadCrewmates();
});

function loadCrewmates() {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const crewmatesGrid = document.getElementById('crewmatesGrid');
    
    try {
        console.log('Loading crewmates from local storage...');
        
        // Use local storage instead of Supabase
        const crewmates = window.crewmateStorage.getAllCrewmates();
        
        console.log('Crewmates loaded:', crewmates);
        
        loadingMessage.style.display = 'none';
        
        if (!crewmates || crewmates.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        renderCrewmates(crewmates);
        
    } catch (error) {
        console.error('Error loading crewmates:', error);
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'Error loading crewmates: ' + error.message;
        errorMessage.style.display = 'block';
    }
}

function renderCrewmates(crewmates) {
    const grid = document.getElementById('crewmatesGrid');
    grid.innerHTML = '';
    
    crewmates.forEach(crewmate => {
        const card = createCrewmateCard(crewmate);
        grid.appendChild(card);
    });
}

function createCrewmateCard(crewmate) {
    const card = document.createElement('div');
    card.className = 'crewmate-card';
    card.onclick = () => {
        window.location.href = `crewmate-detail.html?id=${crewmate.id}`;
    };
    
    const colorEmoji = getColorEmoji(crewmate.color);
    const hatEmoji = getHatEmoji(crewmate.hat);
    const accessoryEmoji = getAccessoryEmoji(crewmate.accessory);
    const skillEmoji = getSkillEmoji(crewmate.skill);
    const personalityEmoji = getPersonalityEmoji(crewmate.personality);
    
    card.innerHTML = `
        <div class="crewmate-header">
            <div class="crewmate-name">${colorEmoji} ${crewmate.name}</div>
            <div class="crewmate-actions">
                <button class="btn btn-secondary" onclick="event.stopPropagation(); editCrewmate('${crewmate.id}')">Edit</button>
            </div>
        </div>
        <div class="crewmate-detail">
            <span class="attribute-badge">${hatEmoji} ${formatText(crewmate.hat)}</span>
            <span class="attribute-badge">${accessoryEmoji} ${formatText(crewmate.accessory)}</span>
        </div>
        <div class="crewmate-detail">
            <span class="attribute-badge">${skillEmoji} ${formatText(crewmate.skill)}</span>
            <span class="attribute-badge">${personalityEmoji} ${formatText(crewmate.personality)}</span>
        </div>
        <div class="crewmate-detail" style="margin-top: 1rem; font-size: 0.9rem; color: #718096;">
            Created: ${formatDate(crewmate.created_at)}
        </div>
    `;
    
    return card;
}

function editCrewmate(crewmateId) {
    window.location.href = `edit-crewmate.html?id=${crewmateId}`;
}

function getColorEmoji(color) {
    const emojis = {
        red: '🔴',
        blue: '🔵',
        green: '🟢',
        yellow: '🟡',
        purple: '🟣',
        orange: '🟠'
    };
    return emojis[color] || '👤';
}

function getHatEmoji(hat) {
    const emojis = {
        none: '🚫',
        tophat: '🎩',
        cap: '🧢',
        cowboy: '🤠',
        party: '🎉',
        crown: '👑'
    };
    return emojis[hat] || '👒';
}

function getAccessoryEmoji(accessory) {
    const emojis = {
        none: '🚫',
        glasses: '👓',
        flag: '🚩',
        toolbox: '🧰',
        medkit: '💊',
        key: '🔑'
    };
    return emojis[accessory] || '🎒';
}

function getSkillEmoji(skill) {
    const emojis = {
        novice: '🟢',
        intermediate: '🟡',
        advanced: '🟠',
        expert: '🔴'
    };
    return emojis[skill] || '⭐';
}

function getPersonalityEmoji(personality) {
    const emojis = {
        brave: '💪',
        smart: '🧠',
        funny: '😂',
        kind: '❤️',
        mysterious: '🔮'
    };
    return emojis[personality] || '😊';
}

function formatText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}