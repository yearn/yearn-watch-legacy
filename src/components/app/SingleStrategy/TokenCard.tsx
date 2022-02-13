import MuiCardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { LabelTypography, SubTitle } from '../../common/Labels';

type KeyValue = {
    name: string;
    symbol: string;
    link: string | JSX.Element;
    balance: number;
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
        vertical-align: top;
        border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    }
`;
const TokenCard = (props: CardContentProps) => {
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
                                    <SubTitle> Name: </SubTitle>
                                    <LabelTypography>
                                        {res.name}
                                    </LabelTypography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <SubTitle> Symbol: </SubTitle>
                                    <LabelTypography>
                                        {res.symbol}
                                    </LabelTypography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <SubTitle> Address: </SubTitle>
                                    <LabelTypography>
                                        {res.link}
                                    </LabelTypography>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <SubTitle> Balance: </SubTitle>
                                    <LabelTypography>
                                        {res.balance}
                                    </LabelTypography>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableHead>
            </Table>
        </MuiCardContent>
    );
};

export default TokenCard;
