import React, { PropsWithChildren } from "react";
import style from "./Filter.module.css";

type FilterProps = {};

const Filter: React.FC<PropsWithChildren<FilterProps>> = ({ children }) => {
  return <div className={style.container}>{children}</div>;
};

export default Filter;
