import React, { useState, useEffect } from 'react';
import '../css/stockPortfolio.css';
import {SANDBOXURL, VERSION, APIKEY} from '../constants';

function StockPortfolio(props) {
    const [openPrice, setOpenPrice ] = useState("");
    const [latestPrice, setLatestPrice ] = useState("");
    
    useEffect(() => {
        const interval = setInterval(() => {
            fetchStockPrices();
        }, 2000);
        return () => {
            clearInterval(interval);
          };
    }, [openPrice, latestPrice]);

    const fetchStockPrices = () => {
        fetch(SANDBOXURL + VERSION + `stock/${props.ticker}/quote?token=${APIKEY}`)
        .then(resp => {
            if (resp.ok)
                return resp.json()
            throw resp;
        })
        .then(data => {
            setOpenPrice(data.previousClose)
            setLatestPrice(data.latestPrice)
        })
        .catch(error =>{
            // console.log(error.status);       too many api calls
        })
    }
    
    const convertNumToCurrencyFormat = (price) => {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    const compareStockPrice = () => {
        if(latestPrice > openPrice) {
            return "green"
        }
        if(latestPrice === openPrice) {
            return "grey"
        }
        return "red"
    }

    return (
        props ? (  
        <div className="stockPortfolio">
            <div>({props.ticker.toUpperCase()}) - {props.quantity} share(s)    <span className={"stockCurrentPrice " + compareStockPrice()}>{convertNumToCurrencyFormat(props.price * props.quantity)}</span></div>
            <div className="stockOpenPrice">open price:       {openPrice !== "" && convertNumToCurrencyFormat(openPrice * props.quantity)} </div>
            <div className="stockLatestPrice">latest price:     {latestPrice !== "" && convertNumToCurrencyFormat(latestPrice * props.quantity)}</div>
        </div>
        )
        : 
        null
    );
}

export default StockPortfolio;