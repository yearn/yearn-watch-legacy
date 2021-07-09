import MuiCardContent from '@material-ui/core/CardContent';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MediaQuery from 'react-responsive';

type KeyValue = {
    key: string;
    value: string | JSX.Element;
    render?: boolean;
};

type CardContentProps = {
    data: KeyValue[];
};

const CardContent = (props: CardContentProps) => {
    const { data } = props;

    return (
        <MuiCardContent>
            <Table>
                <TableHead>
                    {data.map((res: KeyValue, index: number) => {
                        const { render = false } = res;
                        if (render) {
                            return res.value;
                        }
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {res.key}
                                    <MediaQuery query="(max-device-width: 1224px)">
                                        <br />
                                        {res.value}
                                    </MediaQuery>{' '}
                                </TableCell>
                                <MediaQuery query="(min-device-width: 1224px)">
                                    {' '}
                                    <TableCell>{res.value}</TableCell>
                                </MediaQuery>
                            </TableRow>
                        );
                    })}
                </TableHead>
            </Table>
        </MuiCardContent>
    );
};

export default CardContent;
