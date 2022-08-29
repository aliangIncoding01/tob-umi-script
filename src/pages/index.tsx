import CustomStorage from '@/utils/storage'
import React, { useEffect } from 'react'
import styles from './index.less'

const storage = new CustomStorage({ isEncrypt: true, type: 'localStorage' })
const IndexPage = () => {
  const a = (a: number, b: number) => {
    return a + b
  }
  useEffect(() => {
    storage.setStorage('newYjl', 111)
  })
  return (
    <div>
      <p className={styles.title} onClick={() => a(1, 2)}>
        Page index1
      </p>
    </div>
  )
}

export default IndexPage
