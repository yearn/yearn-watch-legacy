import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
       
        background-image: ${({ theme }) => theme.backgroundImage};
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        background-size: cover;

        color: ${({ theme }) => theme.text};
        font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
        transition: all 0.50s linear;
  }
  `;
