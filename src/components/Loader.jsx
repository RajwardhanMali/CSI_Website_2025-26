
import React, { useEffect } from 'react';
import styled from 'styled-components';
import '../styles/Loader.css';
import colors from '../constants/colors';

const Loader = () => {
  useEffect(() => {
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('hide-scrollbar');
    document.documentElement.classList.add('hide-scrollbar');
    
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.classList.remove('hide-scrollbar');
      document.documentElement.classList.remove('hide-scrollbar');
    };
  }, []);

  return (
    <StyledWrapper>
      <div className="loader-container">
        <div className="loader">
          <div className="loader-square" />
          <div className="loader-square" />
          <div className="loader-square" />
          <div className="loader-square" />
          <div className="loader-square" />
          <div className="loader-square" />
          <div className="loader-square" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: visible;
  
  /* Additional scrollbar prevention */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    overflow: visible;
  }

  .loader {
   position: relative;
   width: 96px;
   height: 96px;
   transform: rotate(45deg) scale(1.6);
   transform-origin: center;
   opacity: 1;
   overflow: visible;
  }

  .loader-square {
   position: absolute;
   top: 0;
   left: 0;
   width: 28px;
   height: 28px;
   margin: 2px;
   border-radius: 0px;
   background: ${colors.primary};
   animation: square-animation 10s ease-in-out infinite both;
   box-shadow: none;
   will-change: left, top;
  }

  .loader-square:nth-child(1) { animation-delay: 0s; }
  .loader-square:nth-child(2) { animation-delay: -1.4285714286s; }
  .loader-square:nth-child(3) { animation-delay: -2.8571428571s; }
  .loader-square:nth-child(4) { animation-delay: -4.2857142857s; }
  .loader-square:nth-child(5) { animation-delay: -5.7142857143s; }
  .loader-square:nth-child(6) { animation-delay: -7.1428571429s; }
  .loader-square:nth-child(7) { animation-delay: -8.5714285714s; }


`;

export default Loader;
