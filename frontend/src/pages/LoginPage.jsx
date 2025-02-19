// pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { login, getUserInfo } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
  
    try {
      const loginResult = await dispatch(login(userData)).unwrap();
      console.log("Login result:", loginResult); // Now it's used for logging
      await dispatch(getUserInfo());
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };
  

  // Navigate when user data (including role) is available
  useEffect(() => {
    if (user && user.role) {
      if (user.role === "stadium_admin") {
        navigate("/stadium/dashboard");
      } else if (user.role === "overall_admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  return (
    <div className="container auth__container">
      <h1 className="main__title">
        Login <BiLogInCircle />
      </h1>
      {isLoading && <Spinner />}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={password}
          required
        />
        <Link to="/reset-password">Forget Password?</Link>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
