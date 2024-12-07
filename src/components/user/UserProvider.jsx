import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';

function UserProvider({ children }) {
  const { isAuthenticated } = useAuthStore();
  const { loadProfile, clearProfile } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('UserProvider: Loading profile for authenticated user');
      loadProfile();
    } else {
      console.log('UserProvider: Clearing profile for unauthenticated user');
      clearProfile();
    }
  }, [isAuthenticated, loadProfile, clearProfile]);

  return children;
}

export default UserProvider; 