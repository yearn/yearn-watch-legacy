import MuiCardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MediaQuery from 'react-responsive';
import { LabelTypography, SubTitle } from '../../common/Labels';

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
        vertical-align: top;
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
                                    <SubTitle>
                                        {res.key}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {res.value}
                                        </MediaQuery>
                                    </SubTitle>
                                </StyledTableCell>

                                <MediaQuery query="(min-device-width: 1224px)">
                                    <StyledTableCell>
                                        <LabelTypography>
                                            {res.value}
                                        </LabelTypography>
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
