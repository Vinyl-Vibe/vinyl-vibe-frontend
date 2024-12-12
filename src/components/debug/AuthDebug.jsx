import { useAuthStore } from '../../store/auth';
import { tokenStorage } from '../../lib/token';

export function AuthDebug() {
    const { user, isAuthenticated, isAdmin, isLoading } = useAuthStore();
    
    if (process.env.NODE_ENV === 'production') return null;
    
    return (
        <div style={{ 
            position: 'fixed', 
            bottom: 0, 
            right: 0, 
            background: '#000', 
            color: '#fff',
            padding: '10px',
            fontSize: '12px'
        }}>
            <pre>
                {JSON.stringify({
                    token: tokenStorage.get() ? 'exists' : 'none',
                    user: user ? user.email : 'none',
                    isAuthenticated,
                    isAdmin,
                    isLoading
                }, null, 2)}
            </pre>
        </div>
    );
} 