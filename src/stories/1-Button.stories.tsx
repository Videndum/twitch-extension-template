import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { Button } from 'react-native'

export default {
  title: 'Button'
}

export const text = () => (
  <Button title="Hello Button" onPress={action('clicked')} />
)

// On-Device Register
storiesOf('Button', module).add('Text', text)
