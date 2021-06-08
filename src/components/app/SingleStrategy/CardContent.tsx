import MuiCardContent from '@material-ui/core/CardContent';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MediaQuery from 'react-responsive';

type CardContentProps = {
    data: any;
};

const CardContent = (props: CardContentProps) => {
    const { data } = props;

    return (
        <MuiCardContent>
            <Table>
                <TableHead>
                    {data.map((res: any, index: number) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {res.name}
                                    <MediaQuery query="(max-device-width: 1224px)">
                                        <br />
                                        {res.strategyName}
                                    </MediaQuery>{' '}
                                </TableCell>
                                <MediaQuery query="(min-device-width: 1224px)">
                                    {' '}
                                    <TableCell>{res.strategyName}</TableCell>
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
