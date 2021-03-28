const express = require( 'express' )
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const MongoClient = require( 'mongodb' ).MongoClient;
const app = express()

app.use( cors() )
app.use( bodyParser.json() )
require( 'dotenv' ).config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6zee.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );
app.get( '/', ( req, res ) => {
    res.send( 'Hello ema watson!' )
} )



client.connect( err => {
    const productsCollection = client.db( "ema-john-store" ).collection( "products" );
    const ordersCollection = client.db( "ema-john-store" ).collection( "order" );
    app.post( '/addProduct', ( req, res ) => {
        const product = req.body

        productsCollection.insertOne( product )
            .then( result => {
                console.log( result.insertedCount )
                res.send( result.insertedCount )
            } )
    } )

    app.get( '/products', ( req, res ) => {
        productsCollection.find( {} )
            .toArray( ( err, docs ) => {
                res.send( docs )
            } )
    } )

    app.get( '/product/:key', ( req, res ) => {
        productsCollection.find( { key: req.params.key } )
            .toArray( ( err, docs ) => {
                res.send( docs[0] )
            } )
    } )

    app.post( '/productsByKeys', ( req, res ) => {
        const productKeys = req.body;
        productsCollection.find( { key: { $in: productKeys } } )
            .toArray( ( err, docs ) => {
                res.send( docs )
            } )
    } )

    app.post( '/addOrder', ( req, res ) => {
        const order = req.body

        ordersCollection.insertOne( order )
            .then( result => {

                res.send( result.insertedCount > 0 )
            } )
    } )


} );



app.listen(process.env.PORT ||  5000 )
