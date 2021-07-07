import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { getList } from '../services/list';

// we can create a separate new component for this
const PlayerInfo = ({Id, PFName, SkillDesc, Value, UpComingMatchesList}) => {
    const UpComingMatches = UpComingMatchesList[0].CCode !== ''
        ? `${UpComingMatchesList[0].CCode} vs ${UpComingMatchesList[0].VsCCode}`
        : 'No Matches'

    const matchTime = UpComingMatchesList[0].MDate;
    const localMatchTime = matchTime !== '' ? new Date(Date.parse(matchTime)) : ''; 

    // Fetch the images from public folder
    const imgUrl = process.env.PUBLIC_URL + '/player-images/' + Id + '.jpg';

    return (
        <Col xs={4} md={3} key={Id} className="player-info">
            <Card>
                <Card.Body>
                    <Card.Img variant="top" src={imgUrl} />
                    <Card.Title>{ PFName }</Card.Title>
                    <Card.Subtitle className="text-muted">{ SkillDesc }</Card.Subtitle>
                    <Card.Text>
                        <p>Value: {Value}</p>
                        <p>
                            Matches: {UpComingMatches}
                            <br />Time: {localMatchTime.toLocaleString()}
                        </p>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
};

const PlayersList = () => {
    const [playerList, setPlayerList] = useState([]);
    const [searchText, setSearchText] = useState([]);

    useEffect(() => {
        let mounted = true;
        getList()
            .then(items => {
                if(mounted) {
                    setPlayerList([ ...items.playerList ]);
                }
            });
        return () => mounted = false;
    }, []);

    const handleChange = (event) => {
        event.preventDefault(); 
        setSearchText(event.target.value);
    }

    // Filter the list based on search 
    const searchedPlayers = playerList.filter(player =>
        player.PFName.includes(searchText) || player.TName.includes(searchText)
    );
    const updatePlayerList = searchedPlayers.length === 0 ? playerList : searchedPlayers;
    // Sort the players list in ascending order of palyer Value
    updatePlayerList.sort((a, b) => a.Value - b.Value);

    return (
        <div>
            <Container>
                <Row className="search-input">
                    <Col xs={9} md={6}>
                        <input placeholder="Search" value={searchText} onChange={e => handleChange(e)}/>
                    </Col>
                </Row>
                <Row className="show-grid">
                    {
                        updatePlayerList.map(player => 
                            <PlayerInfo
                                { ...player }
                            />
                        )
                    }
                </Row>
            </Container>
            
        </div>
    );
}
export default PlayersList;
