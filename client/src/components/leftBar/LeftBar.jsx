import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import LearningPlan from "../../assets/learningplan.png";
import NewPlan from "../../assets/newplan.png";
import SubscribePlan from "../../assets/subscribeplan.png";
import ResharedPlan from "../../assets/resharedplan.png";
// import PrivatePlan from "../../assets/privateplan.png";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={"/upload/" + currentUser.profilePic} alt="User" />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="Friends" />
            <span>Friends</span>
          </div>
        </div>
        <hr />
        
        <hr />
        <div className="menu">
          <span>Others</span>
         
       
          <div className="item">
            <img src={Courses} alt="Courses" />
            <span>Courses</span>
          </div>
          <Link to="/all-learning-plans" style={{ textDecoration: "none", color: "#000" }}>
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

            {/* ✅ New Reshared Plans Link */}
            <Link to="/learning-plans" style={{ textDecoration: "none", color: "#000" }}>
            <div className="item">
              <img src={ResharedPlan} alt="Reshared Plan" />
              <span>Reshared Plans</span>
            </div>
          </Link>

          {/* <Link to="/privateplans" style={{ textDecoration: "none", color: "#000" }}>
            <div className="item">
              <img src={PrivatePlan} alt="Private Plan" />
              <span>Privately Shared Plans</span>
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
