import {AuthenticationStore} from "./authenticationStore.js";
import {authApi} from "../api/auth.js";

class RootStore {
    constructor() {
        this.authenticationStore = new AuthenticationStore(authApi);
    }
}

const rootStore = new RootStore();
export default rootStore;