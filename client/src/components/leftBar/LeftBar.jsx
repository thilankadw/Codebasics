import "./leftBar.scss";
import NewPlan from "../../assets/newplan.png";
import LearningPlan from '../../assets/learningplan.png';
import SubscribePlan from '../../assets/subscribeplan.png';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);


  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <Link to="/learning-plans" style={{ textDecoration: "none", color: "#000" }}>
            <div className="item">
              <img src={LearningPlan} alt="Learning Plan" />
              <span>Learning Plans</span>
            </div>
          </Link>
          <Link to="/create-new-learning-plan" style={{ textDecoration: "none", color: "#000" }}>
            <div className="item">
              <img src={NewPlan} alt="New Plan" />
              <span>New Learning Plan</span>
            </div>
          </Link>
          <Link to="/mylearning-plans" style={{ textDecoration: "none", color: "#000" }}>
            <div className="item">
              <img src={SubscribePlan} alt="New Plan" />
              <span>Subscribed Learning Plans</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
