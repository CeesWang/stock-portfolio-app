import React from 'react';
import '../css/navBar.css';
import { Link } from 'react-router-dom';
function NavBar() {
    return (
        <div className="navBar">
            <Link className="navItem" to="/transactions">Transactions</Link>
            <div className="navBarDivider"> | </div>
            <Link className="navItem" to="/portfolio">Portfolio</Link>
        </div>
    );
}

export default NavBar;