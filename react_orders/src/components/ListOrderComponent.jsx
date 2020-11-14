import React, { Component } from 'react'
import OrdersService from '../services/OrdersService'
import moment from 'moment'
import ReactPaginate from 'react-paginate';

class ListOrderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            orders: [],
            searchTerm: '',
            dateRanges: ["All time", "Last week", "Today"],
            selectedRange: "All time",
            pageCount: 0,
            page: 0
        }
        this.addOrder = this.addOrder.bind(this);
        this.editOrder = this.editOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }

    deleteOrder(id) {
        OrdersService.deleteOrder(id).then(res => {
            this.setState({ orders: this.state.orders.filter(order => order._id !== id) });
        })
            .catch(error => {
                alert(error.response.data.message.message)
            })
    }
    viewOrder(id) {
        this.props.history.push(`/view-order/${id}`);
    }
    editOrder(id) {
        this.props.history.push(`/add-orders/${id}`);
    }

    searchOrders = (selectedRange) => {
        OrdersService.getOrders(this.getSearchObject(selectedRange && selectedRange || this.state.selectedRange)).then((res) => {
            this.setState({
                orders: res.data.result,
                pageCount: Math.ceil(res.data.totalPages / 5)
            });
        });
    }
    componentDidMount() {
        this.searchOrders();
    }

    addOrder() {
        this.props.history.push('/add-orders/_add');
    }

    changeSearchHandler = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    getDateRange = (selectedRange) => {
        let now = moment()
        if (selectedRange === "Today") {
            let start = new Date();
            start.setHours(0, 0, 0, 0);
            let end = new Date();
            end.setHours(23, 59, 59, 999);
            return {
                from: start,
                to: end
            }
        } else {
            let start = new Date();
            start.setDate(start.getDate() - 7);
            let end = new Date();
            end.setHours(23, 59, 59, 999);
            return {
                from: start,
                to: end
            }
        }
    }

    getSearchObject = (selectedRange) => {
        let obj = {
            search_text: this.state.searchTerm,
            page: this.state.page
        }
        if (selectedRange && selectedRange != "All time") {
            obj['date_range'] = this.getDateRange(selectedRange)
        }
        return obj;
    }
    searchHandler = (event) => {
        this.searchOrders()
    }

    changeDateRangeHandler = (event) => {
        this.state.selectedRange = event.target.value
        this.searchOrders(event.target.value);
    }

    handlePageClick = (event) => {
        this.state.page = event.selected
        this.searchOrders();
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Orders List</h2>
                <div className="row">
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={this.addOrder}> Create Orders</button></div>
                    <div className="form-group">
                        <select className="form-control"
                            placeholder="Select a user"
                            refs="user"
                            required="true"
                            onChange={this.changeDateRangeHandler}>
                            {
                                this.state.dateRanges.map((obj) => {
                                    return <option value={obj}
                                        selected={obj == this.selectedRange ? true : false}
                                    >{obj}</option>
                                })
                            }</select>
                    </div>
                    <div className="form-group center">
                        <input placeholder="Search here"
                            name="emailId" className="form-control"
                            value={this.state.searchTerm} onChange={this.changeSearchHandler} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={this.searchHandler}>Search</button></div>
                </div>
                <br></br>
                <div className="row">
                    <table className="table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th> User</th>
                                <th> Product</th>
                                <th> Price</th>
                                <th> Quantity</th>
                                <th> Total</th>
                                <th> Date</th>
                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.orders.map(
                                    order =>
                                        <tr key={order._id}>
                                            <td> {order.user_info.first_name} {order.user_info.last_name} </td>
                                            <td> {order.product_info.name}</td>
                                            <td> {order.product_info.price}</td>
                                            <td> {order.quantity}</td>
                                            <td> {order.discounted_price}</td>
                                            <td> {moment(order.updatedAt).format("DD, MMM YYYY, h:mm:ss a")}</td>
                                            <td>
                                                <button onClick={() => this.editOrder(order._id)} className="btn btn-info">Update </button>
                                                <button style={{ marginLeft: "10px" }} onClick={() => this.deleteOrder(order._id)} className="btn btn-danger">Delete </button>
                                                <button style={{ marginLeft: "10px" }} onClick={() => this.viewOrder(order._id)} className="btn btn-info">View </button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={'prev'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />

                </div>

            </div>
        )
    }
}

export default ListOrderComponent
