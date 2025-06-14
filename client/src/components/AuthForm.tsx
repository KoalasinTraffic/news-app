import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../contexts';

export default function AuthForm({ isLogin }) {
  const navigate = useNavigate();
  const { isAuth, authLogin, authRegister } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let res = '';
    if (isLogin) {
      res = await authLogin(username, password);
    } else {
      res = await authRegister(username, password, confirmPassword, email);
    }
    if (res === 'success') {
      navigate('/');
    } else {
      setErrorMessage(res);
    }
  };

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    (async () => {
      const result = await isAuth();
      if (result) {
        return navigate('/');
      }
    })();
    if (isActive) {
      setIsLoading(false);
    }
    return () => {
      isActive = false; // cleanup
    };
  }, []); // run on screen focus

  // Show nothing before loading complete
  if (isLoading) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <label>
          <span>Username:</span>
          <div>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </label>

        <label>
          <span>Password:</span>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>

        {!isLogin && (
          <div>
            <label>
              <span>Confirm Password:</span>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </label>

            <label>
              <span>Email:</span>
              <div>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>
          </div>
        )}

        <p style={{ color: 'red' }}>{errorMessage.length > 0 ? errorMessage : '\u00A0'}</p>

        <form onSubmit={handleSubmit}>
          <button type="submit">{isLogin ? 'Log in' : 'Sign up'}</button>
        </form>

        <p>{'\u00A0'}</p>

        {!isLogin ? (
          <a href="/login">Already have an account? Log in here.</a>
        ) : (
          <a href="/register">Don't have an account? Sign up here.</a>
        )}
      </div>
    );
  }
}
