import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Dashboard from "./components/Dashboard";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #ffffff;
    margin: 0;
    font-family: 'Arial', sans-serif;
  }
`;

const theme = {
  colors: {
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1E1E1E",
    error: "#CF6679",
    text: "#ffffff",
    onPrimary: "#000000",
    onSecondary: "#000000",
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    onError: "#000000",
  },
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <h1>Network Traffic Dashboard</h1>
        <Dashboard />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
