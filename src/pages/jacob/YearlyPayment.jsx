import "../../styles/dashboardCss/subscription.css";
import payment from "../../assets/public/paymentsymbol.svg";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const YearlyPayment = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const currentPlan = user?.plan;
  const handleChoosePlan = (amount, plan) => {
    navigate("/dashboard/make-payment", { state: { amount, plan } });
  };
  return (
    <>
      <div className="monthlyusub">
        <div className="monthlyfreemium">
          <div className="monthlysubcontainer">
            <div className="paymentsymboldiv">
              <img src={payment} />
            </div>
            <h1>Freemium</h1>
            <span className="started">Freemium plan for started </span>
            <div className="subofferdiv">
              <div className="offercontainer">
                <div className="lifesuboffer">
                  <FiCheckCircle className="subiconfirst2" size={42} />
                  <span className="yearlytext">
                    Limited access to JAMB past Questions(e.g: 2000 - 2001 past
                    question)
                  </span>
                </div>
                <div className="lifesuboffer">
                  <FiCheckCircle className="subiconfirst2" size={40} />
                  <span className="yearlytext">
                    Limited access to Jamb mock exam questions (e.g: Twice
                    daily)
                  </span>
                </div>
                <div className="lifesuboffer">
                  <FiCheckCircle className="subiconfirst2" size={22} />
                  <span className="yearlytext">
                    Can’t remove choosen subject
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="subbuttondiv">
              <button className="planbutton" disabled={true}>
                Choose plan
              </button>
            </div> */}
          </div>
        </div>
        <div className="monthlypremium">
          <div className="monthlypremiumcontainer">
            <div className="paymentsymboldiv">
              <img src={payment} />
            </div>
            <h1>premium</h1>
            <span>Get the best value for your money</span>

            <div className="premiumbofferdiv">
              <div className="premiumsuboffer">
                <FiCheckCircle className="subiconfirst1" size={25} />
                <span>Full access to Jamb Past Questions .</span>
              </div>
              <div className="premiumsuboffer">
                <FiCheckCircle className="subiconfirst1" size={20} />
                <span>Full access to mock Exam</span>
              </div>
              <div className="premiumsuboffer">
                <FiCheckCircle className="subiconfirst1" size={25} />
                <span>Access to choose and remove subject.</span>
              </div>
              <div className="premiumsuboffer">
                <FiCheckCircle className="subiconfirst1" size={22} />
                <span>Access to legacy bot.</span>
              </div>
              <div className="subamountddiv">
                <h1 className="subamount">#500</h1>
              </div>
              <div className="monthlysubtextdiv">
                <span className="monthlysubtext">Monthly Subscription</span>
              </div>
              <div className="subbuttondiv">
                <button
                  className="planbutton1"
                  onClick={() => handleChoosePlan(500, "Monthly")}
                  disabled={currentPlan === "Monthly"}>
                  {currentPlan === "Monthly" ? "Subcribed" : "Choose plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lifesub">
          <div className="lifesubcontainer">
            <div className="paymentsymboldiv">
              <img src={payment} />
            </div>
            <h1 className="accessmodel">Premium</h1>
            <span className="lifevalue">Get the best value for your money</span>

            <div className="offercontainer">
              <div className="lifesuboffer">
                <FiCheckCircle className="subiconfirst2" size={25} />
                <span className="yearlytext">
                  Full access to all Jamb Past Questions.
                </span>
              </div>
              <div className="lifesuboffer">
                <FiCheckCircle className="subiconfirst2" size={20} />
                <span className="yearlytext">Full access to mock Exam</span>
              </div>
              <div className="lifesuboffer">
                <FiCheckCircle className="subiconfirst2" size={25} />
                <span className="yearlytext">
                  Access to choose and remove subject.
                </span>
              </div>
              <div className="lifesuboffer">
                <FiCheckCircle className="subiconfirst2" size={22} />
                <span className="yearlytext">Access to legacy bot.</span>
              </div>
            </div>
            <div className="subamountddiv1">
              <h1 className="subamount1">#5,000</h1>
            </div>
            <div className="yearlysubtextdiv">
              <span className="yearlysubtext">Yearly Subscription</span>
            </div>
            <div className="subbuttondiv1">
              <button
                className="planbutton1"
                onClick={() => handleChoosePlan(5000, "Yearly")}
                disabled={currentPlan === "Yearly"}>
                {currentPlan === "Yearly" ? "Subcribed" : "Choose plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YearlyPayment;
