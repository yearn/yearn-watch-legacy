import { Card } from '@material-ui/core';
import styled from 'styled-components';

const StyledCard = styled(Card).withConfig({
    shouldForwardProp: (props) => props.toString() !== 'emergencyExit',
})<{
    emergencyExit?: string;
}>`
    && {
        background-color: ${({ theme }) => theme.container};
        color: ${({ theme }) => theme.title};
        margin-left: auto;
        margin-right: auto;
        border: ${({ theme, emergencyExit }) =>
            emergencyExit === 'false' ? theme.error : ''} !important;
        @media (max-width: 1400px) {
            max-width: 85%;
        }
        @media (max-width: 700px) {
            max-width: 100%;
        }
    }
`;

export default StyledCard;
