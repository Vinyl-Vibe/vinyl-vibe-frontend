// Token storage utilities
export const tokenStorage = {
    get: () => {
        const token = localStorage.getItem('token');
        console.log('Token get:', token ? 'Token exists' : 'No token');
        return token;
    },
    set: (token) => {
        if (!token) {
            console.log('Token set: No token provided');
            return false;
        }
        localStorage.setItem('token', token);
        console.log('Token set: Token stored');
        return true;
    },
    remove: () => {
        console.log('Token remove: Removing token');
        localStorage.removeItem('token');
    },
    isValid: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token validation: No token found');
            return false;
        }
        
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.log('Token validation: Invalid format');
                return false;
            }
            
            const payload = JSON.parse(atob(parts[1]));
            if (!payload.exp) {
                console.log('Token validation: No expiration');
                return false;
            }
            
            const isValid = payload.exp * 1000 > Date.now();
            console.log('Token validation:', isValid ? 'Valid' : 'Expired');
            return isValid;
        } catch (error) {
            console.log('Token validation: Error parsing token');
            return false;
        }
    }
}; 