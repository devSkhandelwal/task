const mongoose = require("mongoose");

const removedItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  removedProduct: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model("removedItem", removedItemSchema);
