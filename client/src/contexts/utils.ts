export async function delToken() {
  localStorage.removeItem('token');
}

export async function getToken() {
  return localStorage.getItem('token');
}

export async function setToken(token: any) {
  localStorage.setItem('token', token);
}

export function isUserObject(res: any): boolean {
  try {
    if (typeof res === 'string') {
      return false;
    }
    if (res && res.username && res.email) {
      // TODO: check if typeof is custom UserObject
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function processError(error: any): string {
  //console.error(error);
  try {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message; // catches res.status().json
    }
    return error.message; // catches throw new Error()
  } catch (clientError) {
    console.error(clientError);
    return 'Client failed to process error.';
  }
}

// Cannot overload function with register, because user may leave other fields blank
export function checkLogin(username: string, password: string): string {
  if (username.length === 0) {
    return 'Username is required.';
  }
  if (password.length === 0) {
    return 'Password is required.';
  }
  return 'success';
}

export function checkRegister(
  username: string,
  password: string,
  confirmPassword: string,
  email: string
): string {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (username.length === 0) {
    return 'Username is required.';
  }
  if (password.length === 0) {
    return 'Password is required.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match. Please try again.';
  }
  if (email.length === 0 || !emailPattern.test(email)) {
    return 'Email is invalid.';
  }
  return 'success';
}
