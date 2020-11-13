import React, { Component } from 'react'
import OrdersService from '../services/OrdersService';
import ProductService from '../services/ProductService';
import UserService from '../services/UserService';

class CreateOrderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            product_id: '',
            user_id: '',
            quantity: '',
            users: [],
            products: [],
            error: ["", "", ""]
        }
        this.changeProductHandler = this.changeProductHandler.bind(this);
        this.changeUserHandler = this.changeUserHandler.bind(this);
        this.changeQuantityHandler = this.changeQuantityHandler.bind(this);
        this.saveOrUpdateOrder = this.saveOrUpdateOrder.bind(this);
    }

    componentDidMount() {

        ProductService.getProducts(this.state.id).then((res) => {
            let products = res.data;
            this.setState({
                products: products
            });
        });
        UserService.getUsers(this.state.id).then((res) => {
            let users = res.data;
            this.setState({
                users: users
            });
        });
        if (this.state.id === '_add') {
            return
        } else {
            OrdersService.getOrderById(this.state.id).then((res) => {
                let order = res.data;
                this.setState({
                    quantity: order.quantity,
                    user_id: order.user._id,
                    product_id: order.product._id
                });
            });
        }
    }
    saveOrUpdateOrder = (e) => {
        e.preventDefault();
        let order = { product_id: this.state.product_id, user_id: this.state.user_id, quantity: Number(this.state.quantity) };
        if (this.state.id != '_add') {
            order = { product: this.state.product_id, user: this.state.user_id, quantity: Number(this.state.quantity) };
        }
        console.log('order => ' + JSON.stringify(order));
        if (this.handleValidation()) {
            if (this.state.id === '_add') {
                OrdersService.createOrder(order).then(res => {
                    this.props.history.push('/orders');
                })
                    .catch(error => {
                        alert(error.response.data.message.message)
                    })
            } else {
                OrdersService.updateOrder(order, this.state.id).then(res => {
                    this.props.history.push('/orders');
                }).catch(error => {
                    alert(error.response.data.message.message)
                })
            }
        }
    }

    handleValidation = () => {
        let isValid = true
        let error = ["", "", ""]
        if (this.state.product_id == "") {
            isValid = false
            error[0] = 'Please select a product'
        }
        if (this.state.user_id == "") {
            isValid = false
            error[1] = 'Please select a user'

        }
        if (this.state.quantity == "" || isNaN(this.state.quantity)) {
            isValid = false
            error[2] = 'Please enter a number'
        }
        this.setState({ error: error });
        return isValid
    }

    changeUserHandler = (event) => {
        this.setState({ user_id: event.target.value });
    }

    changeProductHandler = (event) => {
        this.setState({ product_id: event.target.value });
    }

    changeQuantityHandler = (event) => {

        this.setState({ quantity: event.target.value });
    }

    cancel() {
        this.props.history.push('/orders');
    }

    getTitle() {
        if (this.state.id === '_add') {
            return <h3 className="text-center">Create Order</h3>
        } else {
            return <h3 className="text-center">Update Order</h3>
        }
    }

    render() {
        return (
            <div>
                <br></br>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            {
                                this.getTitle()
                            }
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label> Product: </label>
                                        <select className="form-control"
                                            placeholder="Select a product"
                                            refs="product"
                                            required="true"
                                            onChange={this.changeProductHandler}>
                                            <option value='1' selected="true" disabled>Select a product</option>
                                            {
                                                this.state.products.map((obj) => {
                                                    return <option value={obj.id}
                                                        selected={obj.id == this.state.product_id ? true : false}
                                                    >{obj.name}</option>
                                                })
                                            }</select>
                                        {(this.state.error[0] !== '')
                                            ? <span style={{ color: "red" }}>{this.state.error[0]}</span>
                                            : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label> User: </label>
                                        <select className="form-control"
                                            placeholder="Select a user"
                                            refs="user"
                                            required="true"
                                            onChange={this.changeUserHandler}>
                                            <option value='1'
                                                selected="true" disabled="true">Select a user</option>
                                            {
                                                this.state.users.map((obj) => {
                                                    return <option value={obj.id}
                                                        selected={obj.id == this.state.user_id ? true : false}
                                                    >{obj.first_name} {obj.last_name}</option>
                                                })
                                            }</select>
                                        {(this.state.error[1] !== '')
                                            ? <span style={{ color: "red" }}>{this.state.error[1]}</span>
                                            : ''
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label> Quantity: </label>
                                        <input placeholder="Enter the quantity"
                                            refs="quantity"
                                            required="true"
                                            name="emailId" className="form-control" pattern="[0-9]*"
                                            value={this.state.quantity} onChange={this.changeQuantityHandler} />
                                        {(this.state.error[2] !== '')
                                            ? <span style={{ color: "red" }}>{this.state.error[2]}</span>
                                            : ''
                                        }
                                    </div>
                                    <button className="btn btn-success" onClick={this.saveOrUpdateOrder}>Save</button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{ marginLeft: "10px" }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default CreateOrderComponent
