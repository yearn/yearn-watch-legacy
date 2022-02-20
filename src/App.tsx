import { useMemo } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
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

const App = () => {
    const [theme, themeToggler] = useDarkMode();

    const themeMode = useMemo(() => {
        return theme === 'light' ? lightTheme : darkTheme;
    }, [theme]);

    return (
        <Router>
            <ThemeProvider theme={themeMode}>
                <GlobalStyles />
                <NavBar themeToggler={themeToggler} theme={theme} />
                <StrategyReportProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/network/:network" element={<Home />} />
                        <Route
                            path="/network/:network/query"
                            element={<Query />}
                        />
                        <Route
                            path="/network/:network/query/:groupingId/group/:groups"
                            element={Query}
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
            </ThemeProvider>
        </Router>
    );
};

export default App;
