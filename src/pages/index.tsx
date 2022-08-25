import React from 'react'
import styles from './index.less'

const IndexPage = () => {
  const a = (a, b) => {
    return a + b
  }
  return (
    <div>
      <p className={styles.title} onClick={() => a(1, 2)}>
        Page index
      </p>
    </div>
  )
}

export default IndexPage
