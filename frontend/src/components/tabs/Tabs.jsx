import React from "react";
import "./tabs.css";
const Tabs = ({ options, selected, onChange, id = "radio-" }) => {
  return (
    <div className="tabContainer" key={id} id={id}>
      <div className="tabs" key={id} id={id}>
        {options.map((option, index) => {
          return (
            <div
              key={id + option.id + index}
              className={option.id === selected ? "glider" : ""}
            >
              <input
                type="radio"
                value={option.id}
                id={id + index}
                name="tabs"
                onChange={onChange}
                checked={option.id === selected}
              />
              <label className="tab" for={id + index}>
                {option.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
