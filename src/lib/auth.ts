let token: string | null = null;
export function setToken(t: string) {
  token = t;
}
export function getToken() {
  return token;
}
