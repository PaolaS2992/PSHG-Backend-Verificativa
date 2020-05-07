const { Router } = require('express');
const collection = require('../connection/collection');

const router = Router();

router.post('/agregacion', (req, res) => {
    const {
        cust_id,
        amount,
        status
    } = req.body;
    let db;
    return collection('demo_ordenes')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.insertOne({cust_id, amount, status}))
      .then((result) => res.send(result.ops[0]));
});

router.get('/agregacion', (req, res) => {
    let db;
    return collection('demo_ordenes')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
          {$match: {status: 'A'}},
          {$group: {_id: '$cust_id', total: {$sum:'$amount'}}}
      ]).toArray())
      .then((result) => res.send(result))
});

router.get('/agregacion1', (req, res) => {
    let db;
    return collection('demo_ordenes')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.distinct('cust_id'))
      .then((result) => res.send(result))
});

// 1. lookup - Union de igualdad unica.
router.get('/agregacion2', (req, res) => {
    let db;
    return collection('demo_ordenes')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
          {
            $lookup: {
                from: 'demo_inventory',
                localField: 'item',
                foreignField: 'sku',
                as: 'inventory_docs'
            }
          }
      ]).toArray())
      .then((result) => res.send(result))
});

// 2. lookup - Union de igualdad unica.
router.get('/agregacion3', (req, res) => {
    let db;
    return collection('demo_classes')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
          {
            $lookup: {
                from: 'demo_members',
                localField: 'enrollmentlist',
                foreignField: 'name',
                as: 'enrollee_info'
            }
          }
      ]).toArray())
      .then((result) => res.send(result))
});

// 3. lookup con $mergeObject
router.get('/agregacion4', (req, res) => {
    let db;
    return collection('demo_orders')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
          {
            $lookup: {
                from: 'demo_items',
                localField: 'item',
                foreignField: 'item',
                as: 'fromItems'
            }
          },
          {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
          },
          {
              $project: { fromItems: 0 }
          }
      ]).toArray())
      .then((result) => res.send(result))
});

// 4. lookup multiples.

router.get('/agregacion5', (req, res) => {
    let db;
    return collection('demo_orders1')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
        {
           $lookup:
              {
                from: "demo_warehouses",
                let: { order_item: "$item", order_qty: "$ordered" },
                pipeline: [
                   { $match:
                      { $expr:
                         { $and:
                            [
                              { $eq: [ "$stock_item",  "$$order_item" ] },
                              { $gte: [ "$instock", "$$order_qty" ] }
                            ]
                         }
                      }
                   },
                   { $project: { stock_item: 0, _id: 0 } }
                ],
                as: "stockdata"
              }
         }
     ]).toArray())
      .then((result) => res.send(result))
});

// Subconsulta no corelacionada 
router.get('/agregacion6', (req, res) => {
    let db;
    return collection('demo_absences')
      .then((dbCollection) => db = dbCollection)
      .then(() => db.aggregate([
        {
           $lookup:
              {
                from: "demo_holidays",
                pipeline: [
                   { $match: { year: 2018 } },
                   { $project: { _id: 0, date: { name: "$name", date: "$date" } } },
                   { $replaceRoot: { newRoot: "$date" } }
                ],
                as: "holidays"
              }
         }
     ]).toArray())
      .then((result) => res.send(result))
});

module.exports = router;

