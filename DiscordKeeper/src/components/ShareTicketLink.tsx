import React, { useState } from 'react';
import { FaShareFromSquare } from 'react-icons/fa6';
import { MdOutlineDoneOutline } from 'react-icons/md';

const CopyUrlComponent: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy URL');
    }
  };

  return (
    <div className="my-4">
      <button onClick={handleCopy} className="btn btn-primary flex items-center">
        {copied ? <MdOutlineDoneOutline className="mr-2" /> : <FaShareFromSquare className="mr-2" />}
        Copy URL
      </button>
    </div>
  );
};

export default CopyUrlComponent;
