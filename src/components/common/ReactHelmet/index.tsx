import React from 'react';
import { Helmet } from 'react-helmet';

type ReactHelmetProps = {
    title: string;
};

const ReactHelmet = (props: ReactHelmetProps) => {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{props.title}</title>
        </Helmet>
    );
};

export default ReactHelmet;
