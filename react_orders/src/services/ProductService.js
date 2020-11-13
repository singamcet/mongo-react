import axios from 'axios';

const PRODUCT_API_BASE_URL = "http://localhost:3001/api/product";

class ProductService {

    getProducts(){
        return axios.get(PRODUCT_API_BASE_URL);
    }
    getProductById(id){
        return axios.get(PRODUCT_API_BASE_URL+"/"+id);
    }
}

export default new ProductService()