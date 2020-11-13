const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'product'},
        quantity : Number,
        total_price : Number,
        discounted_price:Number        
      },
      { timestamps: true }
    );
    schema.plugin(mongooseAggregatePaginate);
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const orders = mongoose.model("orders", schema);
    return orders;
  };
  