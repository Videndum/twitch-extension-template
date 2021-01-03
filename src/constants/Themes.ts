import {
    DarkTheme as Dark,
    DefaultTheme as Default,
    NavigationContainer
} from '@react-navigation/native'

export const DarkTheme = {
    ...Dark,
    colors: {
        ...Dark.colors,
        background: 'transparent'
    }
}

export const DefaultTheme = {
    ...Default,
    colors: {
        ...Default.colors,
        background: 'transparent'
    }
} 