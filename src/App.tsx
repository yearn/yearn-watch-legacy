import { useMemo } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { Theme } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalStyles } from './components/theme/globalStyles';
import { useDarkMode } from './components/theme/useDarkMode';
import { lightTheme, darkTheme } from './components/theme/Themes';
import {
    Home,
    SingleVault,
    NavBar,
    Query,
    SingleStrategy,
    HealthCheckReport,
} from './components/app';
import { StrategyReportProvider } from './contexts/StrategyReportContext';
import { Risk } from './components/app/Risk';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const muiTheme = createTheme();

const App = () => {
    const [theme, themeToggler] = useDarkMode();

    const themeMode = useMemo(() => {
        return theme === 'light' ? lightTheme : darkTheme;
    }, [theme]);

    return (
        <Router>
            <ThemeProvider theme={muiTheme}>
                <StyledComponentsThemeProvider theme={themeMode}>
                    <GlobalStyles />
                    <NavBar themeToggler={themeToggler} theme={theme} />
                    <StrategyReportProvider>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/network/:network"
                                element={<Home />}
                            />
                            <Route
                                path="/network/:network/query"
                                element={<Query />}
                            />
                            <Route
                                path="/network/:network/query/:groupingId/group/:groups"
                                element={<Query />}
                            />
                            <Route
                                path="/vault/:vaultId"
                                element={<SingleVault />}
                            />
                            <Route
                                path="/vault/:vaultId/strategy/:strategyId"
                                element={<SingleStrategy />}
                            />
                            <Route
                                path="/network/:network/vault/:vaultId"
                                element={<SingleVault />}
                            />
                            <Route
                                path="/network/:network/vault/:vaultId/strategy/:strategyId"
                                element={<SingleStrategy />}
                            />
                            <Route
                                path="/network/:network/report"
                                element={<HealthCheckReport />}
                            />
                            <Route
                                path="/network/:network/risk"
                                element={<Risk />}
                            />
                            <Route
                                path="/risk"
                                element={
                                    <Navigate
                                        to="/network/ethereum/risk"
                                        replace={true}
                                    />
                                }
                            />
                        </Routes>
                    </StrategyReportProvider>
                </StyledComponentsThemeProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;
