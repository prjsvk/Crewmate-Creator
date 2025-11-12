document.addEventListener('DOMContentLoaded', function() {
    console.log('Crewmate detail page loaded');
    
    const urlParams = new URLSearchParams(window.location.search);
    const crewmateId = urlParams.get('id');
    
    if (!crewmateId) {
        showError('No crewmate ID provided.');
        return;
    }
    
    loadCrewmateDetail(crewmateId);
});

function loadCrewmateDetail(crewmateId) {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const detailContainer = document.getElementById('detailContainer');
    
    try {
        console.log('Loading crewmate details for ID:', crewmateId);
        
        // Use local storage instead of Supabase
        const crewmate = window.crewmateStorage.getCrewmateById(crewmateId);
        
        if (!crewmate) throw new Error('Crewmate not found');
        
        console.log('Crewmate details loaded:', crewmate);
        
        loadingMessage.style.display = 'none';
        detailContainer.style.display = 'block';
        renderCrewmateDetail(crewmate);
        
    } catch (error) {
        console.error('Error loading crewmate:', error);
        loadingMessage.style.display = 'none';
        showError('Error loading crewmate: ' + error.message);
    }
}

function renderCrewmateDetail(crewmate) {
    const container = document.getElementById('detailContainer');
    
    const colorEmoji = getColorEmoji(crewmate.color);
    const hatEmoji = getHatEmoji(crewmate.hat);
    const accessoryEmoji = getAccessoryEmoji(crewmate.accessory);
    const skillEmoji = getSkillEmoji(crewmate.skill);
    const personalityEmoji = getPersonalityEmoji(crewmate.personality);
    
    container.innerHTML = `
        <div class="detail-header">
            <h2>${colorEmoji} ${crewmate.name}</h2>
            <div class="detail-actions">
                <a href="edit-crewmate.html?id=${crewmate.id}" class="btn btn-primary">Edit Crewmate</a>
                <a href="crewmates-list.html" class="btn btn-secondary">Back to List</a>
            </div>
        </div>
        
        <div class="attribute-grid">
            <div class="attribute-item">
                <div class="attribute-label">Color</div>
                <div class="attribute-value">${colorEmoji} ${formatText(crewmate.color)}</div>
            </div>
            <div class="attribute-item">
                <div class="attribute-label">Hat Style</div>
                <div class="attribute-value">${hatEmoji} ${formatText(crewmate.hat)}</div>
            </div>
            <div class="attribute-item">
                <div class="attribute-label">Accessory</div>
                <div class="attribute-value">${accessoryEmoji} ${formatText(crewmate.accessory)}</div>
            </div>
            <div class="attribute-item">
                <div class="attribute-label">Skill Level</div>
                <div class="attribute-value">${skillEmoji} ${formatText(crewmate.skill)}</div>
            </div>
            <div class="attribute-item">
                <div class="attribute-label">Personality</div>
                <div class="attribute-value">${personalityEmoji} ${formatText(crewmate.personality)}</div>
            </div>
            <div class="attribute-item">
                <div class="attribute-label">Created</div>
                <div class="attribute-value">${formatDate(crewmate.created_at)}</div>
            </div>
            ${crewmate.updated_at !== crewmate.created_at ? `
            <div class="attribute-item">
                <div class="attribute-label">Last Updated</div>
                <div class="attribute-value">${formatDate(crewmate.updated_at)}</div>
            </div>
            ` : ''}
        </div>
        
        ${crewmate.bio ? `
            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem;">Bio</h3>
                <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #667eea;">
                    ${crewmate.bio}
                </div>
            </div>
        ` : ''}
    `;
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Helper functions
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