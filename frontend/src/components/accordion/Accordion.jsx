import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa"; // Import FontAwesome icons

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={toggleAccordion}>
        {isOpen ? <FaAngleUp /> : <FaAngleDown />} {/* Toggle icon based on isOpen state */}
        <span>{title}</span> {/* Title text */}
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default AccordionItem;
