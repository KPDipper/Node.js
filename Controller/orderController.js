const Order = require("../Model/order");
const OrderItem = require("../Model/orderitem");

//product1,product 2,product3
exports.placeOrder = async (req, res) => {
  //user le order garyo bhane athawa checkout garyo bhane//checkout garyo bhane

  const orderItemId = await Promise.all(
    //sabai insert hunu paryo dherai query hunucha so kurnu parcha for number of items
    // multiple query pathunu parcha tesaile promise.all pathunu parcha//hamile orderitem lai tai order ma pathuna kojeko
    //id harulai tai array ma halne ho

    req.body.orderItems.map(async (orderItem) => {
      //orderItems taia array ma ako value ho

      let newOrderItem = new OrderItem({
        //abha eslai map garera chutako orderitem ma array haeko by quantity and product hamile esleai orderitem table ma insert garyoum

        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItem = await newOrderItem.save(); //hamiel database athawa
      return newOrderItem._id; //product 1 ko id huncha quanity and proudct id bhyo orderitem ko id tyo id haile return garne afnai auto generate id lai ta hami return garcyoum
    })
  );
  //calculating total price:

  // here abha hamile arko table bhanko arko layout for the same function abha user ko lagi price ra aru order ko model bata
  //calculating total price
  //abha esle product price ra quantity sanga multiply garera total price nikalyo euta individual orice nikalyo
  const individualTotalPrice = await Promise.all(
    orderItemId.map(async (orderItem) => {
      const order = await OrderItem.findById(orderItem).populate(
        "product",
        "product_price"
      ); //suppose 1,2,3 id bhyo re orderitem ko  so suppose findbyid le ta id_1 ko product_price nikalcha and populate tai hamile arko table(yesma product ko table)
      const total = order.quantity * order.product.product_price; //here quanity suppose 3 cha ra ra price 100$ dollar cha bahen teso bahne euta  item ko total price tai 3*100 bhyo
      return total;
    })
  );
  /*
arr = [1,2,3,4,5]
arr.reduce((acc,curr)=>{return acc+curr})
acc = 1, curr = 2
acc = 1+2, curr = 3
acc = 3+3, curr = 4
acc = 6+4, curr = 5
acc = 10+5 
return 15
*/

  const TotalPrice = individualTotalPrice.reduce((a, b) => a + b); //using reduce function so now we can now find grand total price of item 1 item 2 and item 3

  let order = new Order({
    //abha hamile yeslai table athwa layout ma save garya ho
    OrderItems: orderItemId,
    user: req.body.user,
    shippingAddress: req.body.shippingAddress,
    shippingAddress2: req.body.shippingAddress2,
    phone: req.body.phone,
    totalPrice: TotalPrice, //yo total price mathi bata ako
  });
  order = await order.save(); //table lai save garya
  if (!order) {
    //yedi bhayena bhane save then error dekhunas
    return res.status(400).json({ error: "order could not be plaed" });
  }
  res.send(order); //if save bhyo bhane haile respose dekahune of saved order table
};
//mathi ko await tai total caluclate ko lagi ho so jaba samma tala code complete hudea total kei calcualte hunna
//bitra ko table tai product ko table read garna ko lagi so jaba samma product

// //o[phoe order laptop cha arko headphone
// abha id: phone ko product id,quantity

// order: [orderitemID]//esari place order ma orderitem return hunchas

//to view all the items we order all that we add to the cart:
//here yesma tai sabi user ko list dekhaucha for user
exports.viewOrderList = async (req, res) => {
  const order = await Order.find().populate("user", "name"); //find le tai hami sab list herne ra populate user ko name bata herna ko lagi
  //populate tai user ra name ni dkehunu paryo ra garena bhane id matra dkehuacha ra populate garyo bhane name ni aucha
  //id already aucha even with out populate
  if (!order) {
    return res.status(400).json({ error: "order could not be plaed" });
  }
  res.send(order);
};

//to view order details:
//since abha url ma aucha ra particual euta ko hernu cha bahne hamile teslaie url taner herne ho

// to view order details of a particular order
exports.orderDetail = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "OrderItems",
      populate: { path: "product", populate: "category" },
    }); //here hamile yesma orderitems ko product ko full detail ra tesmathi bhayeko category ko full detail aucha
  if (!order) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(order);
};

//yo sab admin ko lagi ho

//now to view order details of particular user
// to view order details of a particular user
exports.userOrder = async (req, res) => {
  const order = await Order.find({ user: req.params.userid }) //yo tai user ko id matra dekhauha ra tesko multiple order dekhaucha so only particular user ko id matra line so we can see them only
    .populate({
      path: "OrderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(order);
};

//to update order
// to update order
exports.updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderid,
    {
      status: req.body.status, //default staus pending huncha item haru pending huncha tespachi user ko status change garnu paryo like malai order cancel garnu paryo bhane status change garne like pending lai cancel
    }, //here status is delivered
    { new: true }
  );
  if (!order) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send(order);
};

//to delete order
exports.deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.orderid) //order betako/purai data betucha jo order ho and order bitra orderitems haru ni chan hich we need to delete it first
    .then(async (order) => {
      if (order) {
        await order.OrderItems.map(async (orderItem) => {
          //order bitra ko orderitems jun cha teslai map gareko suppose array is 1 2 3 then we delte it
          await orderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({ message: "Order deleted successfully" });
      } else {
        return res.status(400).json({ error: "failed to delete order" });//correct order but wrong id which means databse sanga connet bhyo but wrong id
      }
    })

    .catch((error) => {
      return res.status(400).json({ error: error });//yedi format ma wronf garyo bhane yo aucha so  connect naii hunna datbase sanga 
    });
};

//basically order delte garnu agadi orderitem delte garnu parcha