export default (state = null, action) => {
  switch (action.type) {
    case 'get_token':
      return action.payload;
    default:
      return state
  }
}