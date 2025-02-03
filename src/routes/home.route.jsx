import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/user.slice";
import Header from "../components/header";
import "./style.css";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(user);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div>
      <div>
        <Header />
        <h1>Home</h1>
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
};

export default Home;
