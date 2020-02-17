import React, { useState, useEffect } from 'react';
import Stock from './Stock';
import {BASEBACKENDURL} from '../constants'
import '../css/transactions.css';
import NavBar from './NavBar';

function Transactions(props) {
    const [transactions, setTransactions] = useState([]);
    const [fetched, setFetched] = useState(false);

    const fetchTransactions = () => {
        fetch(BASEBACKENDURL + `users/${props.user.userID}/transactions`)
        .then (resp => resp.json())
        .then (transactions => {
            if (!transactions.error) {
                setTransactions(transactions)
                setFetched(true);
            }
        })

    }
    useEffect(()=> {
        fetchTransactions()
    }, [fetchTransactions]);

    const renderTransactions = () => {
        return fetched ? transactions.map((transaction, index) => <Stock key={index} {...transaction}/>).reverse() : null
    }

    return (
        <div className="transactionsParent">
            <NavBar/>
            <div className="transactionsContainer">
                <header className="transactionsHeader">Transactions</header>
                <div className="transactionsList">
                    {renderTransactions()}
                </div>
            </div>
        </div>

    );
}

export default Transactions;