import MuiCardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MediaQuery from 'react-responsive';

type KeyValue = {
    key: string;
    value: string | JSX.Element;
    renderValue?: JSX.Element;
};

type CardContentProps = {
    data: KeyValue[];
};
const StyledTableRow = styled(TableRow)`
    && {
        background-color: ${({ theme }) => theme.container} !important;
    }
`;
const StyledTableCell = styled(TableCell)`
    && {
        color: ${({ theme }) => theme.title} !important;
        border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    }
`;
const CardContent = (props: CardContentProps) => {
    const { data } = props;

    return (
        <MuiCardContent>
            <Table>
                <TableHead>
                    {data.map((res: KeyValue, index: number) => {
                        const { renderValue } = res;
                        if (renderValue) {
                            return renderValue;
                        }
                        return (
                            <StyledTableRow key={index}>
                                <StyledTableCell>
                                    {res.key}
                                    <MediaQuery query="(max-device-width: 1224px)">
                                        <br />
                                        {res.value}
                                    </MediaQuery>{' '}
                                </StyledTableCell>
                                <MediaQuery query="(min-device-width: 1224px)">
                                    {' '}
                                    <StyledTableCell>
                                        {res.value}
                                    </StyledTableCell>
                                </MediaQuery>
                            </StyledTableRow>
                        );
                    })}
                </TableHead>
            </Table>
        </MuiCardContent>
    );
};

export default CardContent;
