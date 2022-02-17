import { useMemo } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
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

const muiTheme = createTheme();

const App = () => {
    const [theme, themeToggler] = useDarkMode();

    const themeMode = useMemo(() => {
        return theme === 'light' ? lightTheme : darkTheme;
    }, [theme]);

    return (
        <Router>
            <Switch>
                <ThemeProvider theme={muiTheme}>
                    <StyledComponentsThemeProvider theme={themeMode}>
                        <GlobalStyles />
                        <NavBar themeToggler={themeToggler} theme={theme} />
                        <StrategyReportProvider>
                            <Route exact path="/" component={Home} />
                            <Route
                                exact
                                path="/network/:network"
                                component={Home}
                            />
                            <Route
                                exact
                                path="/network/:network/query"
                                component={Query}
                            />
                            <Route
                                exact
                                path="/network/:network/query/:groupingId/group/:groups"
                                component={Query}
                            />
                            <Route
                                exact
                                path="/vault/:vaultId"
                                render={(props) => (
                                    <SingleVault {...props} theme={theme} />
                                )}
                            />
                            <Route
                                exact
                                path="/vault/:vaultId/strategy/:strategyId"
                                component={SingleStrategy}
                            />
                            <Route
                                exact
                                path="/network/:network/vault/:vaultId"
                                render={(props) => (
                                    <SingleVault {...props} theme={theme} />
                                )}
                            />
                            <Route
                                exact
                                path="/network/:network/vault/:vaultId/strategy/:strategyId"
                                component={SingleStrategy}
                            />
                            <Route
                                exact
                                path="/network/:network/report"
                                component={HealthCheckReport}
                            />
                            <Route
                                exact
                                path="/network/:network/risk"
                                component={Risk}
                            />
                            <Route path="/risk">
                                <Redirect to="/network/ethereum/risk" />
                            </Route>
                        </StrategyReportProvider>
                    </StyledComponentsThemeProvider>
                </ThemeProvider>
            </Switch>
        </Router>
    );
};

export default App;
