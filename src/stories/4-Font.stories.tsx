import { storiesOf } from '@storybook/react-native'
import * as Font from 'expo-font'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'

export default {
  title: 'Font'
}

export const CustomFontComponent = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    ; (async () => {
      await Font.loadAsync({
        'retro-regular': require('../assets/fonts/retro-regular.ttf')
      })
      setLoaded(true)
    })()
  }, [])

  if (!loaded) return null
  return (
    <Text
      style={{
        fontFamily: 'retro-regular',
        backgroundColor: 'transparent',
        fontSize: 56,
        color: '#000'
      }}>
      Cool new font
    </Text>
  )
}

// On-Device Register
storiesOf('Font', module).add('Font', () => <CustomFontComponent />)
