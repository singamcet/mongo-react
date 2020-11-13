import React, { Component } from 'react'
import OrdersService from '../services/OrdersService'

class ViewOrderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            order: {
                quantity: '',
                total_price: '',
                discounted_price: ''
            },
            user: {
                first_name: '',
                last_name: '',
                address: '',
                email: ''
            },
            product: {
                name: '',
                price: ''
            }
        }
    }

    componentDidMount() {
        OrdersService.getOrderById(this.state.id).then(res => {
            console.log("--------", JSON.stringify(res.data))
            this.setState({
                order: res.data,
                user: res.data.user,
                product: res.data.product
            });
        })
    }

    render() {
        return (

            <div>
                <br></br>
                <div className="card col-md-6 offset-md-3">
                    <h3 className="text-center"> Order Details</h3>
                    <div className="card-body">
                        <div className="row">
                            <label> Quantity :  </label>
                            <div> {this.state.order.quantity}</div>
                        </div>
                        <div className="row">
                            <label> Total price :  </label>
                            <div> {this.state.order.total_price}</div>
                        </div>
                        <div className="row">
                            <label> Discounted Price :  </label>
                            <div> {this.state.order.discounted_price}</div>
                        </div>
                        <h6 class="card-subtitle mb-2 text-muted text-center">User Details</h6>
                        <div className="row">
                            <label> Name: </label>
                            <div> {this.state.user.first_name} {this.state.user.lastName}</div>
                        </div>
                        <div className="row">
                            <label> Address : </label>
                            <div> {this.state.user.address}</div>
                        </div>
                        <div className="row">
                            <label> Email: </label>
                            <div> {this.state.user.email}</div>
                        </div>
                        <h6 class="card-subtitle mb-2 text-muted text-center">Product Details</h6>

                        <div className="row">
                            <label>Name: </label>
                            <div> {this.state.product.name}</div>
                        </div>
                        <div className="row">
                            <label> Selling Price :  </label>
                            <div> {this.state.product.price}</div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default ViewOrderComponent
