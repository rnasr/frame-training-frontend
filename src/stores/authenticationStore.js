import {authApi} from "../api/auth.js";
import jwtDecode from "jwt-decode";

export class AuthenticationStore {
    authentication = null;
    authApi = null;
    constructor(authApi) {
        this.authApi = authApi;
        let authStr = localStorage.getItem("authentication");
        if (authStr){
            let auth = JSON.parse(authStr);
            this.authentication = new Authentication(
                auth.username, auth.firstName, auth.lastName, auth.clientName, auth.clientId,
                auth.role, auth.jwtToken, auth.refreshToken
            );
        }
    }
    async signIn(username, password) {
        let result = await authApi.login(username, password);
        let claims = jwtDecode(result.jwtToken);
        this.authentication = new Authentication(
            
            claims.username, claims.firstName, claims.lastName, claims.clientName, parseInt(claims.clientId),
            claims.role, result.jwtToken, result.refreshToken                
        );
        console.log ("ROLE:", this.authentication.role);
        localStorage.setItem("authentication", JSON.stringify(this.authentication));
    }

    async refreshToken() {
        if (this.authentication) {
            try {
                let result = await authApi.refreshToken(this.authentication.jwtToken, this.authentication.refreshToken);
                let claims = jwtDecode(result.jwtToken);
                this.authentication = new Authentication(
                    claims.username, claims.firstName, claims.lastName, claims.clientName, parseInt(claims.clientId),
                    claims.role, result.jwtToken, result.refreshToken
                );
                console.log ("REFRESHED ROLE:", this.authentication.role);
                localStorage.setItem("authentication", JSON.stringify(this.authentication));
            } catch (e){
                console.warn("Could not refresh token. Logging out.", e);
                this.logout();
            }
        }
    }

    signedIn() {
        return this.authentication !== null;
    }

    logout() {
        this.authentication = null;
        localStorage.removeItem("authentication");
    }

    isAdminRole(){
        if (this.authentication){
            return this.authentication.role === 'Admin' || this.authentication.role === 'CustomerAdmin' ||
                this.authentication.role === 'SuperUser'
        }
        return false;
    }
}

export class Authentication {
    username = null;
    firstName = null;
    lastName = null;
    clientName =  null;
    clientId = null;
    jwtToken = null;
    refreshToken = null;
    role = null;

    constructor(username, firstName, lastName, clientName, clientId, role, jwtToken, refreshToken) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.clientName = clientName;
        this.clientId = clientId;
        this.jwtToken = jwtToken;
        this.refreshToken = refreshToken;
        this.role = role;
    }
}
