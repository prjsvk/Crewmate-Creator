document.addEventListener('DOMContentLoaded', function() {
    console.log('Create crewmate page loaded');
    
    // Initialize attribute selection
    initializeAttributeSelection();
    
    // Handle form submission
    const form = document.getElementById('createCrewmateForm');
    form.addEventListener('submit', handleFormSubmission);
});

function initializeAttributeSelection() {
    // Set up click handlers for all attribute options
    const attributeContainers = document.querySelectorAll('.attribute-options');
    
    attributeContainers.forEach(container => {
        const options = container.querySelectorAll('.attribute-option');
        const hiddenInput = document.getElementById(container.id.replace('Options', ''));
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options in this container
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Update hidden input value
                hiddenInput.value = option.dataset.value;
            });
        });
    });
}

async function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate that all required attributes are selected
    const requiredFields = ['name', 'color', 'hat', 'accessory', 'skill', 'personality'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        alert('Please fill in all required fields and select all attributes.');
        return;
    }
    
    const crewmateData = {
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
        submitButton.textContent = 'Creating...';
        
        console.log('Creating crewmate:', crewmateData);
        
        // Use local storage instead of Supabase
        const newCrewmate = window.crewmateStorage.createCrewmate(crewmateData);
        
        if (!newCrewmate) {
            throw new Error('Failed to create crewmate');
        }
        
        console.log('Crewmate created successfully:', newCrewmate);
        
        // Show success message
        showMessage('Crewmate created successfully! Redirecting...', 'success');
        
        // Reset form
        form.reset();
        document.querySelectorAll('.attribute-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Redirect to crewmates list after 2 seconds
        setTimeout(() => {
            window.location.href = 'crewmates-list.html';
        }, 2000);
        
    } catch (error) {
        console.error('Error creating crewmate:', error);
        showMessage('Error creating crewmate: ' + error.message, 'error');
    } finally {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Create Crewmate';
    }
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert after the form title
    const formContainer = document.querySelector('.form-container');
    const title = formContainer.querySelector('h2');
    formContainer.insertBefore(messageDiv, title.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}