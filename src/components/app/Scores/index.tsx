import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { useOnGet } from '@typesaurus/react';
import { useAuth } from '../../../contexts/AuthContext';
import { init as initFB } from '../../../utils/firebase';
import { Grouping } from '../../../types/grouping';

// TODO: complete this component

export const Scores = () => {
    const [groups, setgroups] = useState<Grouping[]>([]); // Local signed-in state.
    // const { currentUser, isSignedIn, signOut } = useAuth();

    console.log('groups', groups);
    const { groupings } = initFB();
    const [groupData, { loading, error }] = useOnGet(groupings, 'default');
    if (groups.length === 0 && groupData) {
        setgroups(groupData.data.groups);
    }

    if (groups) {
        return (
            <div>
                <Typography style={{ color: '#fff' }}>
                    <p> Welcome to the Scores!</p>
                </Typography>
            </div>
        );
    } else if (loading) {
        return (
            <div>
                <Typography style={{ color: '#fff' }}>
                    <p>Loading... </p>
                </Typography>
            </div>
        );
    } else if (error) {
        return <div>Failed to load the scores!</div>;
    }
};

export default Scores;
