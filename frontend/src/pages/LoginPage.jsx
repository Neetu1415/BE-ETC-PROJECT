import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { login, reset, getUserInfo } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    const { name, value } = e.target; // Ensure event is destructured properly
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      // Store the tokens in localStorage if available
      if (user?.access && user?.refresh) {
        localStorage.setItem("access_token", user.access);
        localStorage.setItem("refresh_token", user.refresh);
        toast.success("Login successful!");
      }
      navigate("/dashboard");
    }

    dispatch(reset());
    dispatch(getUserInfo());
  }, [isError, isSuccess, user, navigate, dispatch]);

  return (
    <>
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
    </>
  );
};

export default LoginPage;
