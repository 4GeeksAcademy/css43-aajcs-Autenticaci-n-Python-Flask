import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const { userLogged } = store;

  const navigate = useNavigate();
  const [data, setData] = useState({});
  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="card ">
      {userLogged ? navigate("/private") : <h1>sin usuario</h1>}
      <div className="d-flex align-items-center flex-column text-center mt-5">
        <h1>Login!!</h1>

        <div className="card d-flex justify-content-center w-75 px-3">
          <label htmlFor="inputEmail" className="form-label">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="inputEmail"
            className="form-control "
            aria-describedby="emailHelpBlock"
            onChange={(event) => {
              handleChange(event);
            }}
          />

          <label htmlFor="inputPassword5" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="inputPassword5"
            className="form-control "
            aria-describedby="passwordHelpBlock"
            onChange={handleChange}
          />

          <div className="buttons d-flex align-items-center flex-column">
            <button
              className="btn btn-primary  w-50 mx-3 my-3"
              onClick={async () => {
                if (await actions.login(data)) {
                  navigate("/private");
                }
              }}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
