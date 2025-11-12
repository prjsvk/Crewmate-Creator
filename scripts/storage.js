// Local storage management for crewmates
class CrewmateStorage {
    constructor() {
        this.storageKey = 'crewmates';
    }

    // Get all crewmates
    getAllCrewmates() {
        try {
            const crewmates = localStorage.getItem(this.storageKey);
            return crewmates ? JSON.parse(crewmates) : [];
        } catch (error) {
            console.error('Error reading crewmates from storage:', error);
            return [];
        }
    }

    // Save all crewmates
    saveAllCrewmates(crewmates) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(crewmates));
            return true;
        } catch (error) {
            console.error('Error saving crewmates to storage:', error);
            return false;
        }
    }

    // Get a single crewmate by ID
    getCrewmateById(id) {
        const crewmates = this.getAllCrewmates();
        return crewmates.find(crewmate => crewmate.id === id);
    }

    // Create a new crewmate
    createCrewmate(crewmateData) {
        const crewmates = this.getAllCrewmates();
        const newCrewmate = {
            id: this.generateId(),
            ...crewmateData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        crewmates.unshift(newCrewmate); // Add to beginning for recent first
        const success = this.saveAllCrewmates(crewmates);
        
        return success ? newCrewmate : null;
    }

    // Update an existing crewmate
    updateCrewmate(id, updateData) {
        const crewmates = this.getAllCrewmates();
        const index = crewmates.findIndex(crewmate => crewmate.id === id);
        
        if (index === -1) return null;
        
        crewmates[index] = {
            ...crewmates[index],
            ...updateData,
            updated_at: new Date().toISOString()
        };
        
        const success = this.saveAllCrewmates(crewmates);
        return success ? crewmates[index] : null;
    }

    // Delete a crewmate
    deleteCrewmate(id) {
        const crewmates = this.getAllCrewmates();
        const filteredCrewmates = crewmates.filter(crewmate => crewmate.id !== id);
        
        if (filteredCrewmates.length === crewmates.length) return false; // No crewmate found
        
        return this.saveAllCrewmates(filteredCrewmates);
    }

    // Generate a unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Create global storage instance
window.crewmateStorage = new CrewmateStorage();