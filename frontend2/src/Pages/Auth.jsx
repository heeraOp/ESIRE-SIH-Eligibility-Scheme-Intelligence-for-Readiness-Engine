import { useState } from "react";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onSwitchToSignup={() => setIsLogin(false)} />
  ) : (
    <Signup onSwitchToLogin={() => setIsLogin(true)} />
  );
}

export default Auth;
