import React from 'react';
import '../css/stock.css'

function Stock(props) {
    return (
        props ? (  
        <div className="stock">
            {props.status} ({props.ticker.toUpperCase()}) - {props.quantity} share(s) @ {props.price}
        </div>
        )
        : 
        null
    );
}

export default Stock;