import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Header.module.css";
import React, { PropsWithChildren } from "react";

type HeaderProps = {};

const Header: React.FC<PropsWithChildren<HeaderProps>> = ({ children }) => {
  return (
    <div className={style.container}>
      <h1 className={style.textContainer}>
        <span className={style.icon}>
          <FontAwesomeIcon icon={faBolt} />
        </span>
        <span className={style.text}>Just ToDo It!</span>
      </h1>
      {children}
    </div>
  );
};

export default Header;
