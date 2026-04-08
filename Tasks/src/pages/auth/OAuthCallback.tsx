import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../lib/api';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser, setAccessToken } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      navigate('/auth/error');
      return;
    }
    setAccessToken(token);
    authApi.me(token).then((res) => {
      if (!res.success || !res.data?.user) {
        navigate('/auth/error');
        return;
      }
      updateUser(res.data.user);
      navigate(res.data.user.mustChangePassword ? '/inbox' : '/');
    });
  }, [params, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-[color:var(--text-muted)]">
      Signing you in…
    </div>
  );
}
