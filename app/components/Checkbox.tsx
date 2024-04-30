import React, { ChangeEvent } from "react";
import style from "./Checkbox.module.css";

type CheckboxProps = {
  hideChecked: boolean;
  setHideChecked: (newValue: boolean) => void;
};

const Checkbox = ({ hideChecked, setHideChecked }: CheckboxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Extract the new value from the event object
    const newValue = event.target.checked;
    // Call the setHideChecked function with the new value
    setHideChecked(newValue);
  };
  return (
    <label>
      <input
        className={style.checkbox}
        type="checkbox"
        checked={hideChecked}
        onChange={handleChange}
      />
      <span>Hide checked items</span>
    </label>
  );
};
export default Checkbox;
