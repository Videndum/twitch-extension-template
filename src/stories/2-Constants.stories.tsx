import { storiesOf } from '@storybook/react-native'
import Constants from 'expo-constants'
import React from 'react'
import { Text } from 'react-native'

export default {
  title: 'Constants'
}

export const constants = () => <Text>{JSON.stringify(Constants, null, 2)}</Text>

// On-Device Register
storiesOf('Constants', module).add('Constants', constants)
