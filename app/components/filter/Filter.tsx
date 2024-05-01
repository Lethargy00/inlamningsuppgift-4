import React, { PropsWithChildren } from "react";
import style from "./Filter.module.css";

type FilterProps = {};

const Filter: React.FC<PropsWithChildren<FilterProps>> = ({ children }) => {
  return <section className={style.container}>{children}</section>;
};

export default Filter;
