let currentCrewmateId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Edit crewmate page loaded');
    
    const urlParams = new URLSearchParams(window.location.search);
    currentCrewmateId = urlParams.get('id');
    
    if (!currentCrewmateId) {
        showError('No crewmate ID provided.');
        return;
    }
    
    loadCrewmateData(currentCrewmateId);
    initializeAttributeSelection();
    
    const form = document.getElementById('editCrewmateForm');
    form.addEventListener('submit', handleFormSubmission);
    
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', handleDelete);
});

function loadCrewmateData(crewmateId) {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const formContainer = document.getElementById('formContainer');
    
    try {
        console.log('Loading crewmate data for ID:', crewmateId);
        
        // Use local storage instead of Supabase
        const crewmate = window.crewmateStorage.getCrewmateById(crewmateId);
        
        if (!crewmate) throw new Error('Crewmate not found');
        
        console.log('Crewmate data loaded:', crewmate);
        
        loadingMessage.style.display = 'none';
        formContainer.style.display = 'block';
        populateForm(crewmate);
        
    } catch (error) {
        console.error('Error loading crewmate:', error);
        loadingMessage.style.display = 'none';
        showError('Error loading crewmate: ' + error.message);
    }
}

function populateForm(crewmate) {
    document.getElementById('name').value = crewmate.name;
    document.getElementById('color').value = crewmate.color;
    document.getElementById('hat').value = crewmate.hat;
    document.getElementById('accessory').value = crewmate.accessory;
    document.getElementById('skill').value = crewmate.skill;
    document.getElementById('personality').value = crewmate.personality;
    document.getElementById('bio').value = crewmate.bio || '';
    
    // Select the current attribute options
    selectAttributeOption('colorOptions', crewmate.color);
    selectAttributeOption('hatOptions', crewmate.hat);
    selectAttributeOption('accessoryOptions', crewmate.accessory);
    selectAttributeOption('skillOptions', crewmate.skill);
}

function selectAttributeOption(containerId, value) {
    const container = document.getElementById(containerId);
    const options = container.querySelectorAll('.attribute-option');
    
    options.forEach(option => {
        if (option.dataset.value === value) {
            option.classList.add('selected');
        }
    });
}

function initializeAttributeSelection() {
    const attributeContainers = document.querySelectorAll('.attribute-options');
    
    attributeContainers.forEach(container => {
        const options = container.querySelectorAll('.attribute-option');
        const hiddenInput = document.getElementById(container.id.replace('Options', ''));
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                hiddenInput.value = option.dataset.value;
            });
        });
    });
}

async function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const requiredFields = ['name', 'color', 'hat', 'accessory', 'skill', 'personality'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        alert('Please fill in all required fields and select all attributes.');
        return;
    }
    
    const updateData = {
        name: formData.get('name'),
        color: formData.get('color'),
        hat: formData.get('hat'),
        accessory: formData.get('accessory'),
        skill: formData.get('skill'),
        personality: formData.get('personality'),
        bio: formData.get('bio') || ''
    };
    
    try {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Updating...';
        
        console.log('Updating crewmate:', updateData);
        
        // Use local storage instead of Supabase
        const updatedCrewmate = window.crewmateStorage.updateCrewmate(currentCrewmateId, updateData);
        
        if (!updatedCrewmate) {
            throw new Error('Failed to update crewmate');
        }
        
        console.log('Crewmate updated successfully:', updatedCrewmate);
        
        showMessage('Crewmate updated successfully! Redirecting...', 'success');
        
        // Redirect to crewmate detail page after 2 seconds
        setTimeout(() => {
            window.location.href = `crewmate-detail.html?id=${currentCrewmateId}`;
        }, 2000);
        
    } catch (error) {
        console.error('Error updating crewmate:', error);
        showMessage('Error updating crewmate: ' + error.message, 'error');
    } finally {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Update Crewmate';
    }
}

async function handleDelete() {
    if (!confirm('Are you sure you want to delete this crewmate? This action cannot be undone.')) {
        return;
    }
    
    try {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.disabled = true;
        deleteButton.textContent = 'Deleting...';
        
        console.log('Deleting crewmate ID:', currentCrewmateId);
        
        // Use local storage instead of Supabase
        const success = window.crewmateStorage.deleteCrewmate(currentCrewmateId);
        
        if (!success) {
            throw new Error('Failed to delete crewmate');
        }
        
        console.log('Crewmate deleted successfully');
        
        showMessage('Crewmate deleted successfully! Redirecting...', 'success');
        
        // Redirect to crewmates list after 2 seconds
        setTimeout(() => {
            window.location.href = 'crewmates-list.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error deleting crewmate:', error);
        showMessage('Error deleting crewmate: ' + error.message, 'error');
        
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.disabled = false;
        deleteButton.textContent = 'Delete Crewmate';
    }
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const formContainer = document.getElementById('formContainer');
    const title = formContainer.querySelector('h2');
    formContainer.insertBefore(messageDiv, title.nextSibling);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}