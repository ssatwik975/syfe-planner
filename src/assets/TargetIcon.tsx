const TargetIcon = ({ width = 40, height = 40 }: { width?: number; height?: number }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="target-icon"
    >
      <circle cx="20" cy="20" r="18" stroke="#4F67FF" strokeWidth="2" fill="none"/>
      <circle cx="20" cy="20" r="12" stroke="#4F67FF" strokeWidth="2" fill="none"/>
      <circle cx="20" cy="20" r="6" fill="#4F67FF"/>
      <circle cx="20" cy="20" r="2" fill="white"/>
    </svg>
  );
};

export default TargetIcon;