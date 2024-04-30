import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Header.module.css";
import SetTheme from "../SetTheme";
import React from "react";

const Header = () => {
  return (
    <div className={style.container}>
      <h1 className={style.textContainer}>
        <span className={style.icon}>
          <FontAwesomeIcon icon={faBolt} />
        </span>
        <span className={style.text}>Just ToDo It!</span>
      </h1>
      <SetTheme />
    </div>
  );
};

export default Header;
