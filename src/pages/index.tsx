import styles from './index.less'

export default function IndexPage() {
  const calc = (a: number, b: number) => {
    return a - b;
  }
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  )
}
