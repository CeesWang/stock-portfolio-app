import React, { useState, } from 'react';
import StockPortfolio from './StockPortfolio';
import NavBar from './NavBar';
import '../css/portfolio.css';
import { APIKEY, SANDBOXURL,VERSION, BASEBACKENDURL } from '../constants'

function Portfolio(props) {
    const [ticker, setTicker] = useState("");               // hook, ticker of stock
    const [quantity, setQuantity] = useState("");           // hook, amount of stocks
    const [price, setPrice] = useState("");                 // hook, price of stock
    // hooks to display error messages
    const [validCash, setValidCash] = useState(true);
    const [validAmount, setValidAmount] = useState(true);
    const [validTicker, setValidTicker] = useState(true);
    

    const handlePurchase = (e) => {
        e.preventDefault();
        if (!validTicker) {                  // check if ticker exists

        }
        else if (!enoughCash()) {            // check if theres enough cash for user to make the purchase
            setValidCash(false);
        }
        else if (!checkQuantity()) {          // check whether the user typed in a valid amount
            setValidAmount(false);
        }
        else {                               // passed the test, valid purchase
            setValidCash(true);
            setValidTicker(true);
            buyStock();
        }
    }

    const checkQuantity = () => {
        return Number(quantity) > 0 && Number.isInteger(Number(quantity))
    }

    const getLatestPrice = (stock) => {
        fetch (SANDBOXURL + VERSION + `stock/${stock}/price?token=${APIKEY}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw response;
        })
        .then(stockPrice => {
            setValidTicker(true);
            setPrice(stockPrice);
        })
        .catch(error => {                            // ticker does not exit  
            setValidTicker(false);
        })
    }

    const enoughCash = () => {          // check if user can afford the stocks with money in wallet
        return (price * quantity) < props.user.cash;
    }

    const buyStock = () => {
        const userInfo = {"email": props.user.email};
        const stockInfo = {
            "ticker": ticker,
            "quantity": quantity,
            "price": price
        }

        const transactionInfo = {
            "ticker": ticker,
            "quantity": quantity,
            "status": "BUY",
            "price": price
        }
        fetch(BASEBACKENDURL + 'buy-stocks/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userInfo,
                stockInfo,
                transactionInfo
            })
        })
        .then (resp => resp.json())
        .then (data => {
            let userInfo = {
                "name": data.user.name, 
                "email": data.user.email, 
                "cash": data.user.cash, 
                "userID": data.user.id, 
                "stocksWorth": data.stocksWorth,
                "stocks": data.stocks, 
            }
            props.setUser(userInfo)
        })    
    }

    const renderOwnedStocks = () => {
        return props.user ? props.user.stocks.map(stock => <StockPortfolio key={stock.ticker} {...stock} />) : null;
    }

    const convertNumToCurrencyFormat = (price) => {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    
    const findTicker = (e) => {
        getLatestPrice(e.target.value);
        setTicker(e.target.value);

    }

    return (
        <div>
            { Object.keys(props.user).length !== 0 && (         // check if user is loggedIn
                <div>
                    <NavBar/>                
                    <header className="portfolioHeader"> Portfolio ({convertNumToCurrencyFormat(props.user.stocksWorth)}) </header>
                    <div className="portfolioContainer">
                        <div className="stocksContainer">
                            <div className="stocksList">
                                {renderOwnedStocks()}
                            </div>
                        </div>
                        <div className="portfolioDivider"></div>
                        <div className="purchaseContainer">
                            <header id="wallet">Cash - {convertNumToCurrencyFormat(props.user.cash)}</header>
                            <form className="purchaseForm" >
                                <input className="purchaseField" type="text" placeholder="Ticker" value={ticker} onChange={e => findTicker(e)} />
                                <input className="purchaseField" type="text" placeholder="Qty" value={quantity} onClick={e => setValidAmount(true)} onChange={e => setQuantity(e.target.value)} />
                                <input className="purchaseField" type="text" placeholder="Price" value={price && quantity? convertNumToCurrencyFormat(price*quantity): ""} readOnly/>
                                {!validTicker && <p className="purchaseErrorMessage">{ticker} is not valid </p>}
                                {!validAmount && <p className="purchaseErrorMessage">{quantity} is not a valid amount</p>}
                                {(!validCash && !enoughCash()) && <p className="purchaseErrorMessage">not enough cash, {quantity} stock(s) of {ticker} cost {convertNumToCurrencyFormat(price*quantity)}</p>}
                                
                                <input className="purchaseButton" type="submit" value="Buy" onClick={e => handlePurchase(e)}/>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Portfolio;