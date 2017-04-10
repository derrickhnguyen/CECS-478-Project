export const getToken = (token) => {
  return {
    type: 'get_token',
    payload: token
  }
}