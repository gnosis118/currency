import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 200, height = 200, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="95" fill="#2563eb" stroke="#1d4ed8" strokeWidth="5"/>
      
      {/* Currency Symbol Container */}
      <g transform="translate(100,100)">
        {/* Dollar Sign */}
        <text x="-35" y="-15" fill="white" fontSize="36" fontWeight="bold" fontFamily="serif">$</text>
        
        {/* Euro Sign */}
        <text x="10" y="-15" fill="white" fontSize="36" fontWeight="bold" fontFamily="serif">€</text>
        
        {/* Pound Sign */}
        <text x="-35" y="25" fill="white" fontSize="36" fontWeight="bold" fontFamily="serif">£</text>
        
        {/* Yen Sign */}
        <text x="10" y="25" fill="white" fontSize="36" fontWeight="bold" fontFamily="serif">¥</text>
        
        {/* Exchange Arrows */}
        <path d="M -15,-5 L 15,-5 M 10,-10 L 15,-5 L 10,0" stroke="white" strokeWidth="3" fill="none"/>
        <path d="M 15,15 L -15,15 M -10,10 L -15,15 L -10,20" stroke="white" strokeWidth="3" fill="none"/>
      </g>
      
      {/* Company Name Arc */}
      <path 
        id="circle-text" 
        d="M 50,100 A 50,50 0 0,1 150,100" 
        stroke="none" 
        fill="none"
      />
      <text fontSize="12" fill="white" fontWeight="600">
        <textPath href="#circle-text">CURRENCY CONVERTER</textPath>
      </text>
    </svg>
  );
};

export default Logo;