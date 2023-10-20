import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const { userLogged } = store;
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">React Boilerplate</span>
        </Link>
        <div className="ml-auto">
          {!userLogged ? (
            <Link to="/signupPage">
              <button className="btn btn-primary">Sign Up</button>
            </Link>
          ) : (
            <Link to="/">
              <button
                className="btn btn-primary"
                onClick={() => actions.logout()}
              >
                Log Out
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
