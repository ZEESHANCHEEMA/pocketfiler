import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import { useMediaQuery } from "react-responsive";
import Chatbox from '../Chatbox/Chatbox';
import './disputing.css';

const Disputing = () => {

    const isMobile = useMediaQuery({
        query: "(max-width: 768px)",
      });


  return (
    <Sidebar showSidebar={true} >
        <Header headername={"HelpCenter"} />
        <>
        <div className="ProjectActivities__top-box">
          <div className="ProjectActivities__top-box_header">
            <div className="ProjectActivities__top-box_header-txt">
              <h4>Jimmy Carter</h4>
              <div className="disputing-bg__text">
                <p>Dispute</p>
              </div>
            </div>
            <div className="ProjectActivities__top-box_header-btn">
             
                <>
                  <button
                    className="disputing__top-btn"
                  >
                    Withdraw Dispute
                  </button>
                </>
              {/* )} */}
            </div>
          </div>
          <div className='disputing__box' >
          <div className="ProjectActivities__box">
            <p className="ProjectActivities__box1">
              Date <span>Feb 25, 2024</span>
            </p>
            <p className="ProjectActivities__box2">
              Type <span>Sales</span>
            </p>
          </div>
          <div className='disputing__profiles'>
            <img className='disputing__profiles1' src='/Images/HelpCenter/profile 1.svg' alt='/' />
            <img className='disputing__profiles2' src='/Images/HelpCenter/profile 2.svg' alt='/' />
            <img className='disputing__profiles3' src='/Images/HelpCenter/profile 3.svg' alt='/' />
          </div>
          </div>
          <div className="ProjectActivities__txt">
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur.
            </p>
          </div>
        </div>
        <Chatbox />
        </>
    </Sidebar>
  )
}

export default Disputing