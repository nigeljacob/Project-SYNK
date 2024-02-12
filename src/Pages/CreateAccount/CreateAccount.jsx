import React from "react";
import {Link} from "react-router-dom"

const CreateAccount = () => {
  return (
    <div className="tw-w-screen tw-h-screen">
      <p>Create Account</p>
      <Link to="/">Go back to Login</Link>
    </div>
  );
};

export default CreateAccount;
