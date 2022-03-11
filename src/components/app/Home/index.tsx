import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';

import { ErrorAlert } from '../../common/Alerts';

import { VaultsList } from '../../common/VaultsList';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { DEFAULT_NETWORK } from '../../../types';
import { GlobalStylesLoading } from '../../theme/globalStyles';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { useAllVaults } from '../../../hooks';

export const Home = () => {
    const { network = DEFAULT_NETWORK } = useParams() as ParamTypes;
    const { vaults, loading, moreToLoad, error } = useAllVaults(network);

    return (
        <Container maxWidth="lg">
            <div style={{ marginTop: 20 }}>
                {error && (
                    <ErrorAlert
                        message={'Error while loading vaults:'}
                        details={error}
                    />
                )}
                {loading && (
                    <span>
                        <ProgressSpinnerBar label="vaults" />
                        <GlobalStylesLoading />
                    </span>
                )}
                {!loading && !error && (
                    <VaultsList
                        items={vaults}
                        moreToLoad={moreToLoad}
                        network={network}
                    />
                )}
            </div>
        </Container>
    );
};
