import React from "react";
import "./Switch.css";
import { useDarkMode } from "../../../contexts/themeContext";

interface SwitchProps {
  checkedChildren: JSX.Element;
  unCheckedChildren: JSX.Element;
}

const Switch: React.FC<SwitchProps> = ({
  checkedChildren,
  unCheckedChildren,
}) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleChange = () => {
    toggleDarkMode();
  };

  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={handleChange} />
        <span className="slider round">
          {darkMode ? checkedChildren : unCheckedChildren}
        </span>
      </label>
    </div>
  );
};

export default Switch;
