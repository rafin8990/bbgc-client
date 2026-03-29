import React from 'react';
import Hero from './Hero';
import Historypage from '../History/Historypage';
import About from './About';
import LatestNewsEvents from './LatestNewsEvents';
import LatestNotice from './LatestNotice';

const Home = () => {
    return (
        <div>
         <Hero/> 
          <About/>
          <LatestNewsEvents/>
          <LatestNotice/>
        </div>
    );
};

export default Home;