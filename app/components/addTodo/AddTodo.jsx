import style from './AddTodo.module.css'

export default function AddTodo({ children }) {
  return <section className={style.container}>{children}</section>;
}
