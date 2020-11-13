import axios from 'axios';

const USERS_API_BASE_URL = "http://localhost:3001/api/users";

class UserService {

    getUsers(){
        return axios.get(USERS_API_BASE_URL);
    }
}

export default new UserService()