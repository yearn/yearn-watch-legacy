import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {

      background-image: ${({ theme }) => theme.backgroundImage};
      background-repeat: no-repeat; 
      background-position: center;
     
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
      height:100%;
      width:100%; 
      color: ${({ theme }) => theme.text};
      font-family: 'Roboto', sans-serif;
     background-attachment: fixed; 
  
     
  }
  `;

export const GlobalStylesLoading = createGlobalStyle`
  body {
       
        background-image: ${({ theme }) => theme.backgroundImageLoading};
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        background-size: cover;

        color: ${({ theme }) => theme.text};
 
  }
  `;
