
export function authHeader() {
    // return authorization header with jwt token
    let authentication = JSON.parse(localStorage.getItem('authentication'));

    if (authentication) {
        return { 'Authorization': 'Bearer ' + authentication.jwtToken };
    } else {
        return {};
    }
}
