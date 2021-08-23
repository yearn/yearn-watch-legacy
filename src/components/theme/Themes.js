import backgroundImageLight from '../../images/background_image_yearn_watch_light.svg';
import backgroundImageDark from '../../images/background_image_yearn_watch_dark.jpeg';
export const lightTheme = {
    backgroundImage: `url(${backgroundImageLight})`,
    borderConfig: '#EB5757',
    backgroundConfig: 'rgba(255, 255, 255, 0.7)',
    iconTheme: '#212121',
    barProgress: '#EFD631',
    body: '#FFF',
    text: '#363537',
    title: '#333333',
    subtitle: '#828282',
    toggleBorder: '#FFF',
    background: '#363537',
    container: 'rgba(255, 255, 255, 0.7)',
};
export const darkTheme = {
    borderConfig: 'transparent',
    backgroundConfig: '#006AE3',
    backgroundImage: `url(${backgroundImageDark})`,
    iconTheme: '#FAFAFA',
    barProgress: '#006AE3',
    body: '#363537',
    text: '#FAFAFA',
    title: '#FAFAFA',
    subtitle: '#bdbdbd',
    toggleBorder: '#6B8096',
    background: '#999',
    container: '#0a1d3f',
};
