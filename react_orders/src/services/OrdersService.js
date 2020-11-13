import axios from 'axios';

const ORDER_API_BASE_URL = "http://localhost:3001/api/orders";

class OrdersService {

    getOrders(params){
        return axios.post(ORDER_API_BASE_URL+"/search",params);
    }

    createOrder(order){
        return axios.post(ORDER_API_BASE_URL, order);
    }

    getOrderById(orderId){
        return axios.get(ORDER_API_BASE_URL + '/' + orderId);
    }

    updateOrder(order, orderId){
        return axios.put(ORDER_API_BASE_URL + '/' + orderId, order);
    }

    deleteOrder(orderId){
        return axios.delete(ORDER_API_BASE_URL + '/' + orderId);
    }
}

export default new OrdersService()